import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { parseUnits } from 'viem';

import { useEthereumClient, useMirrorContract } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';
import { useAddMyActivity, TransactionTypes, unpackReceipt } from '@/app/store';
import { Button } from '@/components';

type Props = {
  programId: HexString;
  onSuccess: (value: bigint) => void;
};

const TopUpExecBalance = ({ programId, onSuccess }: Props) => {
  const { data: ethClient } = useEthereumClient();
  const { api } = useVaraEthApi();
  const { data: mirrorContract } = useMirrorContract(programId);

  const addMyActivity = useAddMyActivity();

  const approveFn = async (value: bigint) => {
    if (!ethClient) throw new Error('Ethereum client is not found');

    const tx = await ethClient.wvara.approve(programId, value);

    return tx.sendAndWaitForReceipt();
  };

  const topUpFn = async (value: bigint) => {
    if (!api) throw new Error('API is not intialized');
    if (!mirrorContract) throw new Error('Mirror contract is not found');

    const tx = await mirrorContract.executableBalanceTopUp(value);

    return tx.sendAndWaitForReceipt();
  };

  const approve = useMutation({ mutationFn: approveFn });
  const topUp = useMutation({ mutationFn: topUpFn });

  const handleTopUpClick = async () => {
    const value = parseUnits('1', 12);

    const approveReceipt = await approve.mutateAsync(value);

    await addMyActivity({
      type: TransactionTypes.approve,
      value: value.toString(),
      owner: approveReceipt.from,
      spender: programId,
      ...unpackReceipt(approveReceipt),
    });

    const topUpReceipt = await topUp.mutateAsync(value);

    await addMyActivity({
      type: TransactionTypes.executableBalanceTopUp,
      value: String(value),
      programId,
      ...unpackReceipt(topUpReceipt),
    });

    onSuccess(value);
  };

  const isLoading = !api || !ethClient || !mirrorContract || approve.isPending || topUp.isPending;

  const getButtonText = () => {
    if (approve.isPending) return 'Approving';
    if (topUp.isPending) return 'Topping Up';

    return 'Top Up';
  };

  return (
    <Button size="xs" onClick={handleTopUpClick} loadingPosition="start" isLoading={isLoading} variant="secondary">
      {getButtonText()}
    </Button>
  );
};

export { TopUpExecBalance };
