import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';

import SwapSVG from '../../assets/swap.svg?react';
import { TransferBalanceModal } from '../transfer-balance-modal';

const TransferBalance = () => {
  const [isModalOpen, openModal, closeModal] = useModalState();

  return (
    <>
      <Button icon={SwapSVG} text="Transfer" color="grey" size="small" noWrap onClick={openModal} />

      {isModalOpen && <TransferBalanceModal close={closeModal} />}
    </>
  );
};

export { TransferBalance };
