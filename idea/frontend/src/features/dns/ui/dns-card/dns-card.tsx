import { useAccount } from '@gear-js/react-hooks';

import { TimestampBlock } from '@/shared/ui/timestampBlock';
import { IdBlock, OwnerBlock } from '@/shared/ui';

import { Dns } from '../../types';
import { EditDns } from '../edit-dns';
import { DeleteDns } from '../delete-dns';
import styles from './dns-card.module.scss';

type Props = {
  dns: Dns;
  onSuccess: () => void;
};

function DnsCard({ dns, onSuccess }: Props) {
  const { name, address, updatedAt, createdAt, createdBy, admin } = dns;
  const { account } = useAccount();

  const isOwner = createdBy === account?.decodedAddress;
  const timePrefix = updatedAt === createdAt ? 'Created at:' : 'Updated at:';
  const ownerButtonText = admin === account?.decodedAddress ? '(you)' : undefined;

  return (
    <div className={styles.card}>
      <div>
        <h3 className={styles.heading}>{name}</h3>
        <div className={styles.footer}>
          <TimestampBlock timestamp={updatedAt} withIcon prefix={timePrefix} color="light" />
          <IdBlock id={address} size="medium" withIcon color="light" />
          {admin && <OwnerBlock ownerAddress={admin} color="light" buttonText={ownerButtonText} />}
        </div>
      </div>

      {isOwner && (
        <div className={styles.actions}>
          <EditDns initialValues={{ name, address }} onSuccess={onSuccess} />
          <DeleteDns name={name} onSuccess={onSuccess} />
        </div>
      )}
    </div>
  );
}

export { DnsCard };
