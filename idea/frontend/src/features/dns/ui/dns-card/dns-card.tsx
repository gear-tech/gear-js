import { IdBlock } from '@/shared/ui/idBlock';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import { Dns } from '../../types';
import { useAccount } from '@gear-js/react-hooks';
import { EditDns } from '../edit-dns';
import { DeleteDns } from '../delete-dns';
import styles from './dns-card.module.scss';

type Props = {
  dns: Dns;
  onSubmit?: () => void;
};

function DnsCard({ dns, onSubmit }: Props) {
  const { name, address, updatedAt, createdBy } = dns;
  const { account } = useAccount();

  const isEditable = createdBy === account?.decodedAddress;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.heading}>{name}</h3>
        <IdBlock id={address} size="medium" withIcon color="light" />
        <TimestampBlock timestamp={updatedAt} withIcon />
      </div>

      <div className={styles.actions}>
        {isEditable && (
          <>
            <EditDns initialValues={{ name, address }} onSubmit={onSubmit} />
            <DeleteDns name={name} onSubmit={onSubmit} />
          </>
        )}
      </div>
    </div>
  );
}

export { DnsCard };
