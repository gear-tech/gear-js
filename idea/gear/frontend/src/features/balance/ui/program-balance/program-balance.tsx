import { HexString } from '@gear-js/api';
import { useAccount, useBalance } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { useModal } from '@/hooks';

import PlusSVG from '../../assets/plus.svg?react';
import { Balance } from '../balance';

import styles from './program-balance.module.scss';

type Props = {
  id: HexString;
};

function ProgramBalance({ id }: Props) {
  const { account } = useAccount();
  const { balance } = useBalance(id);
  const { showModal } = useModal();

  return (
    <div className={styles.balance}>
      <Balance value={balance} variant="secondary" />

      {account && (
        <Button icon={PlusSVG} color="transparent" onClick={() => showModal('transfer', { defaultAddress: id })} />
      )}
    </div>
  );
}

export { ProgramBalance };
