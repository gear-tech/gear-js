import { Button, Modal } from '@gear-js/ui';
import { useState } from 'react';

import RemoveSVG from '../../assets/remove.svg?react';

const DeclineVoucher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button icon={RemoveSVG} onClick={openModal} color="transparent" />

      {isModalOpen && (
        <Modal heading="Decline Voucher" close={closeModal}>
          Decline
        </Modal>
      )}
    </>
  );
};

export { DeclineVoucher };
