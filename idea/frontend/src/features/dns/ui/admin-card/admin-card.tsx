import { HexString } from '@gear-js/api';
import { getVaraAddress } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import Identicon from '@polkadot/react-identicon';

import CopySVG from '@/shared/assets/images/actions/copyGreen.svg?react';

import { RemoveAdmin } from '../remove-admin';
import styles from './admin-card.module.scss';

type Props = {
  index: number;
  address: HexString;
  name: string;
  admins: HexString[];
  isAdmin: boolean;
  onSuccess: () => void;
};

const getDoubleDigit = (num: number) => (num < 10 ? `0${num}` : num);

function AdminCard({ index, address, name, admins, isAdmin, onSuccess }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.summary}>
        <div className={styles.count}>{getDoubleDigit(index + 1)}</div>

        <div className={styles.address}>
          <Identicon size={16} theme="polkadot" value={address} />
          {getVaraAddress(address)}
          <Button icon={CopySVG} color="transparent" />
        </div>
      </div>

      {isAdmin && admins.length > 0 && <RemoveAdmin name={name} address={address} onSuccess={onSuccess} />}
    </div>
  );
}

export { AdminCard };
