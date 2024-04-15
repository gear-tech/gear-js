import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Button, Modal } from '@gear-js/ui';

import { useSignAndSend } from '@/hooks';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';

import RemoveSVG from '../../assets/remove.svg?react';
import { useModal } from '../../hooks';
import styles from './decline-voucher.module.scss';

type Props = {
  id: HexString;
  onSubmit: () => void;
};

const DeclineVoucher = ({ id, onSubmit }: Props) => {
  const { isApiReady, api } = useApi();
  const signAndSend = useSignAndSend();

  const [isModalOpen, openModal, closeModal] = useModal();

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
        <Modal heading="Decline Voucher" close={closeModal}>
          <p className={styles.text}>
            This action cannot be undone. If you change your mind, voucher&apos;s owner will have to issue a new voucher
            manually.
          </p>

          <div className={styles.buttons}>
            <Button icon={RemoveSVG} text="Submit" onClick={handleSubmitClick} />
            <Button icon={CloseSVG} text="Cancel" color="light" onClick={closeModal} />
          </div>
        </Modal>
      )}
    </>
  );
};

export { DeclineVoucher };
