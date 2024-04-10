import { Button, Modal } from '@gear-js/ui';
import { useState } from 'react';

import RemoveSVG from '../../assets/remove.svg?react';

const RevokeVoucher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button icon={RemoveSVG} onClick={openModal} color="transparent" />

      {isModalOpen && (
        <Modal heading="Revoke Voucher" close={closeModal}>
          Revoke
        </Modal>
      )}
    </>
  );
};

export { RevokeVoucher };
