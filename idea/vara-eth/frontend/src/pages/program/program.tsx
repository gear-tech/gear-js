import { useQueryClient } from '@tanstack/react-query';
import { generatePath, useParams } from 'react-router-dom';
import { formatEther, formatUnits, type Hex } from 'viem';

import { useWrappedVaraBalance } from '@/app/api';
import LoadingSVG from '@/assets/icons/loading.svg?react';
import { Badge, Balance, ChainEntity, HashLink, Skeleton } from '@/components';
import {
  TopUpExecBalance,
  useGetProgramByIdQuery,
  useReadContractState,
  useWatchProgramStateChange,
} from '@/features/programs';
import { SailsProgramPanel } from '@/features/sails';
import { routes } from '@/shared/config';
import { useIdlStorage } from '@/shared/hooks';
import { isUndefined } from '@/shared/utils';

import styles from './program.module.scss';

type Params = {
  programId: Hex;
};

const Program = () => {
  const { programId } = useParams() as Params;
  const queryClient = useQueryClient();

  const { data: program, isLoading } = useGetProgramByIdQuery(programId);
  const codeId = program?.code?.id; // TODO: program.codeId property should be present?

  const { data: programState, refetch, isLoading: isProgramStateLoading } = useReadContractState(programId);
  const isActive = programState && 'Active' in programState.program;
  const isInitialized = isActive && programState.program.Active.initialized;

  const { decimals, isPending: isDecimalsPending } = useWrappedVaraBalance(programId);
  const { idl, isLoading: isIdlLoading, saveIdl } = useIdlStorage(codeId);

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
      .then(() => {
        void refetch();
        void queryClient.invalidateQueries({ queryKey: ['wrappedVaraBalance'] });
      })
      .catch((error) => console.error(error));
  };

  if (isLoading || isProgramStateLoading || isDecimalsPending) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <ChainEntity.Header>
            <ChainEntity.BackButton />
            <ChainEntity.Title id={programId} explorerLink />

            <Skeleton width="4rem" className={styles.status} />
          </ChainEntity.Header>

          <ChainEntity.Data>
            <ChainEntity.Key>Code ID</ChainEntity.Key>
            <Skeleton width="16rem" />

            <ChainEntity.Key>Transaction Hash</ChainEntity.Key>
            <Skeleton width="18rem" />

            <ChainEntity.Key>Program Balance</ChainEntity.Key>
            <Skeleton width="4rem" />

            <ChainEntity.Key>Executable Balance</ChainEntity.Key>
            <Skeleton width="17rem" />

            <ChainEntity.Key>Block Number</ChainEntity.Key>
            <Skeleton width="8rem" />
          </ChainEntity.Data>
        </div>
      </div>
    );
  }

  if (!program || !codeId || isUndefined(decimals)) return <ChainEntity.NotFound entity="program" id={programId} />;

  const hasExecutableBalance = Boolean(programState && programState.executableBalance > 0);
  const programStateFallback = <span className={styles.unavailable}>Unable to read program state</span>;

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
          {programState ? (
            <Balance value={formatEther(BigInt(programState.balance))} units="ETH" />
          ) : (
            programStateFallback
          )}

          <ChainEntity.Key>Executable Balance</ChainEntity.Key>
          {programState ? (
            <div className={styles.balance}>
              {watchBalance.isPending && <LoadingSVG className={styles.balanceSpinner} />}

              <Balance value={formatUnits(BigInt(programState.executableBalance), decimals)} units="WVARA" />

              <TopUpExecBalance
                programId={programId}
                isEnabled={!watchBalance.isPending}
                hasExecutableBalance={hasExecutableBalance}
                onSuccess={handleSuccessfulTopUp}
              />
            </div>
          ) : (
            programStateFallback
          )}

          <ChainEntity.Key>Block Number</ChainEntity.Key>
          <ChainEntity.BlockNumber value={program.blockNumber} date={program.createdAt} />
        </ChainEntity.Data>
      </div>

      <div className={styles.card}>
        <SailsProgramPanel
          programId={programId}
          idl={idl}
          isLoading={isIdlLoading}
          onSaveIdl={saveIdl}
          init={{
            isRequired: !isInitialized,
            isEnabled: hasExecutableBalance && !watchInit.isPending,
            tooltip: hasExecutableBalance ? '' : 'Executable balance top up is required',
            onSuccess: handleSuccessfulInit,
          }}
          hasExecutableBalance={hasExecutableBalance}
        />
      </div>
    </div>
  );
};

export { Program };
