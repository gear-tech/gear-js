import { HexString } from '@gear-js/api';
import { Button, Modal } from '@gear-js/ui';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';

import RemoveSVG from '../../assets/remove.svg?react';
import { useIssueVoucher, useModal } from '../../hooks';
import styles from './decline-voucher.module.scss';

type Props = {
  id: HexString;
};

const DeclineVoucher = ({ id }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModal();
  const { declineVoucher } = useIssueVoucher();

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
            <Button icon={RemoveSVG} text="Submit" onClick={() => declineVoucher(id, closeModal)} />
            <Button icon={CloseSVG} text="Cancel" color="light" onClick={closeModal} />
          </div>
        </Modal>
      )}
    </>
  );
};

export { DeclineVoucher };
