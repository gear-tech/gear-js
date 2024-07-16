import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { useModalState, useSignAndSend } from '@/hooks';
import RemoveSVG from '@/shared/assets/images/actions/remove.svg?react';
import { ConfirmModal } from '@/shared/ui/confirm-modal';

type Props = {
  id: HexString;
  onSubmit: () => void;
};

const DeclineVoucher = ({ id, onSubmit }: Props) => {
  const { isApiReady, api } = useApi();
  const signAndSend = useSignAndSend();

  const [isModalOpen, openModal, closeModal] = useModalState();

  const handleSubmitClick = () => {
    if (!isApiReady) throw new Error('API is not initialized');

    const extrinsic = api.voucher.decline(id);
    const onSuccess = onSubmit;

    signAndSend(extrinsic, 'VoucherDeclined', { onSuccess });
    closeModal();
  };

  return (
    <>
      <Button icon={RemoveSVG} onClick={openModal} color="transparent" />

      {isModalOpen && (
        <ConfirmModal
          title="Decline Voucher"
          text="This action cannot be undone. If you change your mind, voucher's owner will have to issue a new voucher manually."
          confirmText="Submit"
          confirmIcon={RemoveSVG}
          onSubmit={handleSubmitClick}
          close={closeModal}
        />
      )}
    </>
  );
};

export { DeclineVoucher };
