import { Button } from '@gear-js/ui';
import { useState } from 'react';

import { withAccount } from 'shared/ui';

import { ReactComponent as TransferSVG } from '../../assets/transfer.svg';
import { TransferBalanceModal } from '../transfer-balance-modal';
import styles from './transfer-balance.module.scss';

const TransferBalance = withAccount(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button icon={TransferSVG} className={styles.button} onClick={() => setIsModalOpen(true)} />

      {isModalOpen && <TransferBalanceModal close={() => setIsModalOpen(false)} />}
    </>
  );
});

export { TransferBalance };
