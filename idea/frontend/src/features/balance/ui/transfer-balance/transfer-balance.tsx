import { Button, TooltipWrapper } from '@gear-js/ui';
import { useState } from 'react';

import { withAccount } from '@/shared/ui';

import TransferSVG from '../../assets/transfer.svg?react';
import { TransferBalanceModal } from '../transfer-balance-modal';
import styles from './transfer-balance.module.scss';

const TransferBalance = withAccount(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <TooltipWrapper text="Transfer balance">
        <Button
          icon={TransferSVG}
          tooltip="Transfer balance"
          className={styles.button}
          onClick={() => setIsModalOpen(true)}
        />
      </TooltipWrapper>

      {isModalOpen && <TransferBalanceModal close={() => setIsModalOpen(false)} />}
    </>
  );
});

export { TransferBalance };
