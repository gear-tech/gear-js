import { HexString } from '@gear-js/api';

import { OwnerBlock } from '@/shared/ui';

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
        <OwnerBlock ownerAddress={address} maxLength={false} />
      </div>

      {isAdmin && admins.length > 1 && <RemoveAdmin name={name} address={address} onSuccess={onSuccess} />}
    </div>
  );
}

export { AdminCard };
