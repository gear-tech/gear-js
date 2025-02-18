import { useAccount } from '@gear-js/react-hooks';
import { generatePath, Link } from 'react-router-dom';

import { routes } from '@/shared/config';
import { IdBlock, OwnerBlock } from '@/shared/ui';
import { TimestampBlock } from '@/shared/ui/timestampBlock';

import AdminSVG from '../../assets/admin.svg?react';
import { Dns } from '../../types';
import { DeleteDns } from '../delete-dns';
import { EditDns } from '../edit-dns';

import styles from './dns-card.module.scss';

type Props = {
  dns: Dns;
  onSuccess: () => void;
};

function DnsCard({ dns, onSuccess }: Props) {
  const { name, address, updatedAt, createdAt, admins } = dns;
  const { account } = useAccount();

  const isAdmin = account && admins ? admins.includes(account.decodedAddress) : false;
  const timePrefix = updatedAt === createdAt ? 'Created at:' : 'Updated at:';

  return (
    <div className={styles.card}>
      <div>
        <Link to={generatePath(routes.singleDns, { address })} className={styles.heading}>
          {name}
        </Link>

        <div className={styles.footer}>
          <TimestampBlock timestamp={updatedAt} withIcon prefix={timePrefix} color="light" />
          <IdBlock id={address} size="medium" withIcon color="light" />

          {admins.length === 1 ? (
            <OwnerBlock ownerAddress={admins[0]} color="light" buttonText={isAdmin ? '(you)' : ''} />
          ) : (
            <div className={styles.admins}>
              <AdminSVG />
              <span className={styles.admins}>{admins.length} admins</span>
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className={styles.actions}>
          <EditDns initialValues={{ name, address }} onSuccess={onSuccess} secondary />
          <DeleteDns name={name} onSuccess={onSuccess} secondary />
        </div>
      )}
    </div>
  );
}

export { DnsCard };
