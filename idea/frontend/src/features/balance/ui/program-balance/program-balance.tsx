import { HexString } from '@gear-js/api';
import { useAccount, useBalance, useBalanceFormat } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';

import PlusSVG from '../../assets/plus.svg?react';
import styles from './program-balance.module.scss';
import { TransferBalanceModal } from '../transfer-balance-modal';

type Props = {
  id: HexString;
};

function ProgramBalance({ id }: Props) {
  const { account } = useAccount();
  const { balance } = useBalance(id);
  const { getFormattedBalance } = useBalanceFormat();
  const formattedBalance = balance ? getFormattedBalance(balance) : balance;

  const [isModalOpen, openModal, closeModal] = useModalState();

  return (
    <>
      <div className={styles.balance}>
        <p>
          <span className={styles.value}>{formattedBalance?.value}</span>
          &nbsp;
          <span className={styles.unit}>{formattedBalance?.unit}</span>
        </p>

        {account && <Button icon={PlusSVG} color="transparent" onClick={openModal} />}
      </div>

      {isModalOpen && <TransferBalanceModal defaultAddress={id} close={closeModal} />}
    </>
  );
}

export { ProgramBalance };
