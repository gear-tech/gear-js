import { HexString } from '@gear-js/api';
import { Button, Modal } from '@gear-js/ui';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';

import RemoveSVG from '../../assets/remove.svg?react';
import { useIssueVoucher, useModal } from '../../hooks';
import styles from './revoke-voucher.module.scss';

type Props = {
  spender: HexString;
  id: HexString;
};

const RevokeVoucher = ({ spender, id }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModal();
  const { revokeVoucher } = useIssueVoucher();

  return (
    <>
      <Button icon={RemoveSVG} onClick={openModal} color="transparent" />

      {isModalOpen && (
        <Modal heading="Revoke Voucher" close={closeModal}>
          <p className={styles.text}>
            This action cannot be undone. If you change your mind, you&apos;ll need to issue a new voucher manually.
          </p>

          <div className={styles.buttons}>
            <Button icon={RemoveSVG} text="Submit" onClick={() => revokeVoucher(spender, id, closeModal)} />
            <Button icon={CloseSVG} text="Cancel" color="light" onClick={closeModal} />
          </div>
        </Modal>
      )}
    </>
  );
};

export { RevokeVoucher };
