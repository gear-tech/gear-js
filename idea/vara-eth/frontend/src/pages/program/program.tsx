import { HexString } from '@vara-eth/api';
import { generatePath, useParams } from 'react-router-dom';
import { formatEther, formatUnits } from 'viem';

import { useWrappedVaraBalance } from '@/app/api';
import LoadingSVG from '@/assets/icons/loading.svg?react';
import { Badge, Balance, ChainEntity, HashLink, UploadIdlButton } from '@/components';
import {
  TopUpExecBalance,
  useReadContractState,
  useGetProgramByIdQuery,
  useWatchProgramStateChange,
} from '@/features/programs';
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

  const { data: program, isLoading } = useGetProgramByIdQuery(programId);
  const codeId = program?.code?.id; // TODO: program.codeId property should be present?

  const { data: programState, refetch, isLoading: isProgramStateLoading } = useReadContractState(programId);
  const isActive = programState && 'Active' in programState.program;
  const isInitialized = isActive && programState.program.Active.initialized;

  const { decimals, isPending: isDecimalsPending } = useWrappedVaraBalance(programId);
  const { idl, saveIdl } = useIdlStorage(codeId);

  const watchInit = useWatchProgramStateChange(programId);
  const watchBalance = useWatchProgramStateChange(programId);

  const handleSuccessfulInit = () => {
    watchInit
      .mutateAsync({
        name: 'program init',
        isChanged: (_, incoming) => 'Active' in incoming.program && incoming.program.Active.initialized,
      })
      .then(() => refetch())
      .catch((error) => console.error(error));
  };

  const handleSuccessfulTopUp = (value: bigint) => {
    watchBalance
      .mutateAsync({
        name: 'executable program balance',
        isChanged: (current, incoming) =>
          BigInt(incoming.executableBalance) - BigInt(current.executableBalance) === value,
      })
      .then(() => refetch())
      .catch((error) => console.error(error));
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
              {watchInit.isPending && <LoadingSVG className={styles.statusSpinner} />}
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

          <div className={styles.balance}>
            {watchBalance.isPending && <LoadingSVG className={styles.balanceSpinner} />}

            <Balance value={formatUnits(BigInt(programState.executableBalance), decimals)} units="WVARA" />

            <TopUpExecBalance
              programId={programId}
              isEnabled={!watchBalance.isPending}
              onSuccess={handleSuccessfulTopUp}
            />
          </div>

          <ChainEntity.Key>Block Number</ChainEntity.Key>
          <ChainEntity.BlockNumber value={program.blockNumber} date={program.createdAt} />
        </ChainEntity.Data>
      </div>

      <div className={styles.card}>
        {idl ? (
          <SailsProgramActions
            programId={programId}
            idl={idl}
            init={{ isRequired: !isInitialized, isEnabled: !watchInit.isPending, onSuccess: handleSuccessfulInit }}
          />
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
