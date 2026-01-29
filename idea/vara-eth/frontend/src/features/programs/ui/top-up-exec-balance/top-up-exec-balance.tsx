import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { parseUnits } from 'viem';

import { useEthereumClient, useMirrorContract } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';
import { useAddMyActivity, TransactionTypes, unpackReceipt } from '@/app/store';
import { Button } from '@/components';

type Props = {
  programId: HexString;
  isEnabled: boolean;
  onSuccess: (value: bigint) => void;
};

const TopUpExecBalance = ({ programId, isEnabled, onSuccess }: Props) => {
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
    if (!api) throw new Error('API is not initialized');
    if (!mirrorContract) throw new Error('Mirror contract is not found');

    const tx = await mirrorContract.executableBalanceTopUp(value);

    return tx.sendAndWaitForReceipt();
  };

  const approve = useMutation({ mutationFn: approveFn });
  const topUp = useMutation({ mutationFn: topUpFn });

  const handleClick = () => {
    const value = parseUnits('10', 12);

    approve
      .mutateAsync(value)
      .then((receipt) =>
        addMyActivity({
          type: TransactionTypes.approve,
          value: value.toString(),
          owner: receipt.from,
          spender: programId,
          ...unpackReceipt(receipt),
        }),
      )
      .then(() => topUp.mutateAsync(value))
      .then((receipt) =>
        addMyActivity({
          type: TransactionTypes.executableBalanceTopUp,
          value: String(value),
          programId,
          ...unpackReceipt(receipt),
        }),
      )
      .then(() => onSuccess(value))
      .catch((error) => console.error(error));
  };

  const isLoading = !api || !ethClient || !mirrorContract || approve.isPending || topUp.isPending;

  const getButtonText = () => {
    if (approve.isPending) return 'Approving';
    if (topUp.isPending) return 'Topping Up';

    return 'Top Up';
  };

  return (
    <Button
      size="xs"
      onClick={handleClick}
      loadingPosition="start"
      isLoading={isLoading}
      variant="secondary"
      disabled={!isEnabled}>
      {getButtonText()}
    </Button>
  );
};

export { TopUpExecBalance };
