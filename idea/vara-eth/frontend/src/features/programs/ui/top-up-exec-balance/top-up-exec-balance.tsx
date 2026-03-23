import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { parseUnits, Hex } from 'viem';

import { useMirrorContract, useApi, useWrappedVaraBalance } from '@/app/api';
import { useAddMyActivity, TransactionTypes, unpackReceipt } from '@/app/store';
import { ActionButton, Button, Modal } from '@/components';
import { Input } from '@/components/form/input';

import styles from './top-up-exec-balance.module.scss';

type Props = {
  programId: Hex;
  isEnabled: boolean;
  onSuccess: (value: bigint) => void;
  hasExecutableBalance: boolean;
};

function useApprove(programId: Hex) {
  const { data: api } = useApi();

  const approve = async (value: bigint) => {
    if (!api) throw new Error('API is not initialized');

    const tx = await api.eth.wvara.approve(programId, value);

    return tx.sendAndWaitForReceipt();
  };

  return { ...useMutation({ mutationFn: approve }), isLoading: !api };
}

function useTopUp(programId: Hex) {
  const mirrorContract = useMirrorContract(programId);

  const topUp = async (value: bigint) => {
    if (!mirrorContract) throw new Error('Mirror contract is not found');

    const tx = await mirrorContract.executableBalanceTopUp(value);

    return tx.sendAndWaitForReceipt();
  };

  return { ...useMutation({ mutationFn: topUp }), isLoading: !mirrorContract };
}

const TopUpExecBalance = ({ programId, isEnabled, onSuccess, hasExecutableBalance }: Props) => {
  const approve = useApprove(programId);
  const topUp = useTopUp(programId);
  const { decimals } = useWrappedVaraBalance();
  const addMyActivity = useAddMyActivity();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('10');

  const isLoading = approve.isLoading || topUp.isLoading || approve.isPending || topUp.isPending;

  const handleOpenModal = () => {
    if (!isEnabled) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (approve.isPending || topUp.isPending) return;
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    const trimmed = amount.trim();
    if (!trimmed || !decimals) return;

    const value = parseUnits(trimmed, decimals);
    if (value <= 0n) return;

    setIsModalOpen(false);

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

  const getButtonText = () => {
    if (approve.isPending) return 'Approving';
    if (topUp.isPending) return 'Topping Up';

    return 'Top Up';
  };

  const isConfirmDisabled = isLoading || !amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0;

  return (
    <>
      <ActionButton
        size="xs"
        onClick={handleOpenModal}
        loadingPosition="start"
        isLoading={isLoading}
        variant={hasExecutableBalance ? 'secondary' : 'default'}
        disabled={!isEnabled}>
        {getButtonText()}
      </ActionButton>

      {isModalOpen && (
        <Modal
          heading="Top Up Executable Balance"
          close={handleCloseModal}
          size="small"
          action={
            <Button
              size="xs"
              variant="default"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              isLoading={isLoading}>
              Confirm
            </Button>
          }>
          <div className={styles.amountRow}>
            <span>Amount:</span>
            <Input type="number" min={0} step="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
            <span>VARA</span>
          </div>
        </Modal>
      )}
    </>
  );
};

export { TopUpExecBalance };
