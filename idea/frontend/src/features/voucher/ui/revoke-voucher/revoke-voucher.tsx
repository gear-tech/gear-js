import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Button, Modal } from '@gear-js/ui';

import { useSignAndSend } from '@/hooks';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';

import RemoveSVG from '../../assets/remove.svg?react';
import { useModal } from '../../hooks';
import styles from './revoke-voucher.module.scss';

type Props = {
  spender: HexString;
  id: HexString;
  onSubmit: () => void;
};

const RevokeVoucher = ({ spender, id, onSubmit }: Props) => {
  const { isApiReady, api } = useApi();
  const signAndSend = useSignAndSend();

  const [isModalOpen, openModal, closeModal] = useModal();

  const handleSubmitClick = () => {
    if (!isApiReady) throw new Error('API is not initialized');

    const extrinsic = api.voucher.revoke(spender, id);
    const onSuccess = onSubmit;

    signAndSend(extrinsic, 'VoucherRevoked', { onSuccess });
    closeModal();
  };

  return (
    <>
      <Button icon={RemoveSVG} onClick={openModal} color="transparent" />

      {isModalOpen && (
        <Modal heading="Revoke Voucher" close={closeModal}>
          <p className={styles.text}>
            This action cannot be undone. If you change your mind, you&apos;ll need to issue a new voucher manually.
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

export { RevokeVoucher };
