import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { parseUnits } from 'viem';

import { useEthereumClient, useMirrorContract } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';
import { useAddMyActivity, TransactionTypes, unpackReceipt } from '@/app/store';
import LoadingSVG from '@/assets/icons/loading.svg?react';
import { Button } from '@/components';

import styles from './top-up-exec-balance.module.scss';

type Props = {
  programId: HexString;
  onSuccess: () => void;
};

const TopUpExecBalance = ({ programId, onSuccess }: Props) => {
  const { data: ethClient } = useEthereumClient();
  const { api } = useVaraEthApi();
  const { data: mirrorContract } = useMirrorContract(programId);

  const addMyActivity = useAddMyActivity();

  const approveFn = async (value: bigint) => {
    if (!ethClient) throw new Error('Ethereum client is not found');

    const tx = await ethClient.wvara.approve(programId, value);

    await tx.send();

    return tx.getReceipt();
  };

  const topUpFn = async (value: bigint) => {
    if (!api) throw new Error('API is not intialized');
    if (!mirrorContract) throw new Error('Mirror contract is not found');

    const tx = await mirrorContract.executableBalanceTopUp(value);

    await tx.send();

    return tx.getReceipt();
  };

  const watchFn = async (value: bigint) => {
    if (!api) throw new Error('API is not intialized');
    if (!mirrorContract) throw new Error('Mirror contract is not found');

    const currentStateHash = await mirrorContract.stateHash();
    const currentState = await api.query.program.readState(currentStateHash);

    return new Promise<void>((resolve, reject) => {
      const unwatch = mirrorContract.watchStateChangedEvent((stateHash) => {
        api.query.program
          .readState(stateHash)
          .then((state) => {
            if (BigInt(state.executableBalance - currentState.executableBalance) === value) {
              unwatch();
              resolve();
            }
          })
          .catch((error) => {
            unwatch();
            reject(error instanceof Error ? error : new Error(String(error)));
          });
      });
    });
  };

  const approve = useMutation({ mutationFn: approveFn });
  const topUp = useMutation({ mutationFn: topUpFn });
  const watch = useMutation({ mutationFn: watchFn });

  const handleTopUpClick = async () => {
    const value = parseUnits('1', 12);

    const approveReceipt = await approve.mutateAsync(value);

    addMyActivity({
      type: TransactionTypes.approve,
      value: value.toString(),
      owner: approveReceipt.from,
      spender: programId,
      ...unpackReceipt(approveReceipt),
    });

    const topUpReceipt = await topUp.mutateAsync(value);

    addMyActivity({
      type: TransactionTypes.executableBalanceTopUp,
      value: String(value),
      programId,
      ...unpackReceipt(topUpReceipt),
    });

    await watch.mutateAsync(value);

    onSuccess();
  };

  const isLoading = approve.isPending || topUp.isPending || watch.isPending;

  const getButtonText = () => {
    if (approve.isPending) return 'Approving';
    if (topUp.isPending) return 'Topping Up';
    if (watch.isPending) return 'Processing';

    return 'Top Up';
  };

  return (
    // TODO: spinner position prop? loadingText prop?
    <Button size="xs" onClick={handleTopUpClick} disabled={isLoading} variant="secondary">
      {isLoading && <LoadingSVG className={styles.spinner} />}
      {getButtonText()}
    </Button>
  );
};

export { TopUpExecBalance };
