import { HexString } from '@vara-eth/api';
import { generatePath, useParams } from 'react-router-dom';
import { formatEther, formatUnits } from 'viem';

import { useApproveWrappedVara, useWrappedVaraBalance } from '@/app/api';
import { Badge, Balance, Button, ChainEntity, HashLink, UploadIdlButton } from '@/components';
import { useExecutableBalanceTopUp } from '@/features/programs';
import { useReadContractState, useGetProgramByIdQuery } from '@/features/programs/lib';
import { SailsProgramActions } from '@/features/sails';
import { routes } from '@/shared/config';
import { useIdlStorage } from '@/shared/hooks';
import { isUndefined } from '@/shared/utils';

import styles from './program.module.scss';

type Params = {
  programId: HexString;
};

const Program = () => {
  const { programId } = useParams() as Params;

  const approveWrappedVara = useApproveWrappedVara(programId);
  const executableBalanceTopUp = useExecutableBalanceTopUp(programId);

  const { data: program, isLoading } = useGetProgramByIdQuery(programId);
  const codeId = program?.code?.id; // TODO: program.codeId property should be present?

  const { data: programState, refetch, isLoading: isProgramStateLoading } = useReadContractState(programId);
  const isActive = programState && 'Active' in programState.program;
  const isInitialized = isActive && programState.program.Active.initialized;

  const { decimals, isPending: isDecimalsPending } = useWrappedVaraBalance(programId);
  const { idl, saveIdl } = useIdlStorage(codeId);

  const onTopUp = async () => {
    const topUpValue = BigInt(10 * 1e12);
    await approveWrappedVara.mutateAsync(topUpValue);
    await executableBalanceTopUp.mutateAsync(topUpValue);
    // TODO: updated after couple of seconds after the transaction
    await refetch();
  };

  if (isLoading || isProgramStateLoading || isDecimalsPending) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>Loading...</div>
      </div>
    );
  }

  if (!program || !programState || !codeId || isUndefined(decimals)) {
    return <ChainEntity.NotFound entity="program" id={programId} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ChainEntity.Header>
          <ChainEntity.BackButton />
          <ChainEntity.Title id={programId} explorerLink />

          {isActive && (
            <Badge color={isInitialized ? 'primary' : 'secondary'} className={styles.status}>
              {isInitialized ? 'Active' : 'Uninitialized'}
            </Badge>
          )}
        </ChainEntity.Header>

        <ChainEntity.Data>
          <ChainEntity.Key>Code ID</ChainEntity.Key>
          <HashLink hash={codeId} href={generatePath(routes.code, { codeId })} truncateSize="xxl" />

          <ChainEntity.Key>Transaction Hash</ChainEntity.Key>
          <HashLink hash={program.txHash} truncateSize="xxl" explorerLinkPath="tx" />

          <ChainEntity.Key>Program Balance</ChainEntity.Key>
          <Balance value={formatEther(BigInt(programState.balance))} units="ETH" />

          <ChainEntity.Key>Executable Balance</ChainEntity.Key>

          <div className={styles.executableBalance}>
            <Balance value={formatUnits(BigInt(programState.executableBalance), decimals)} units="WVARA" />

            <Button
              size="xs"
              onClick={onTopUp}
              isLoading={executableBalanceTopUp.isPending || approveWrappedVara.isPending}
              variant="secondary">
              Top up
            </Button>
          </div>

          <ChainEntity.Key>Block Number</ChainEntity.Key>
          <ChainEntity.BlockNumber value={program.blockNumber} date={program.createdAt} />
        </ChainEntity.Data>
      </div>

      <div className={styles.card}>
        {idl ? (
          <SailsProgramActions programId={programId} idl={idl} isInitialized={isInitialized} />
        ) : (
          <div className={styles.emptyState}>
            <p>No IDL uploaded. Please upload an IDL file to initialize and interact with the program.</p>
            <UploadIdlButton onSaveIdl={saveIdl} />
          </div>
        )}
      </div>
    </div>
  );
};

export { Program };
