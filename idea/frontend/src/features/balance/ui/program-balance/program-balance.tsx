import { HexString } from '@gear-js/api';
import { useAccount, useBalance } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';

import PlusSVG from '../../assets/plus.svg?react';
import { Balance } from '../balance';
import styles from './program-balance.module.scss';
import { TransferBalanceModal } from '../transfer-balance-modal';

type Props = {
  id: HexString;
};

function ProgramBalance({ id }: Props) {
  const { account } = useAccount();
  const { balance } = useBalance(id);

  const [isModalOpen, openModal, closeModal] = useModalState();

  return (
    <>
      <div className={styles.balance}>
        <Balance value={balance} />

        {account && <Button icon={PlusSVG} color="transparent" onClick={openModal} />}
      </div>

      {isModalOpen && <TransferBalanceModal defaultAddress={id} close={closeModal} />}
    </>
  );
}

export { ProgramBalance };
