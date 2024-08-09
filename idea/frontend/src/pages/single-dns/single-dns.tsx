import { HexString } from '@gear-js/api';
import { useParams } from 'react-router-dom';

import { useSingleDns, EditDns, DeleteDns, AdminCard } from '@/features/dns';
import { IdBlock, List, SearchForm, Table, TableRow, TimestampBlock } from '@/shared/ui';

import styles from './single-dns.module.scss';

type Params = {
  address: HexString;
};

function SingleDns() {
  const { address } = useParams() as Params;

  const { data, refetch } = useSingleDns(address);
  const { name, createdAt, admins } = data || {};

  console.log('data: ', data);

  const renderAdminSkeleton = () => null;
  const renderAdminCard = (_address: HexString, index: number) => <AdminCard index={index} address={_address} />;

  return (
    <div className={styles.container}>
      {name && (
        <header className={styles.header}>
          {/* same as in program page, maybe worth to share */}
          <h2 className={styles.heading}>{name}</h2>

          <div className={styles.buttons}>
            <EditDns initialValues={{ name, address }} onSuccess={refetch} />
            <DeleteDns name={name} onSuccess={refetch} />
          </div>
        </header>
      )}

      <div className={styles.table}>
        <Table>
          <TableRow name="Program ID">{address && <IdBlock id={address} />}</TableRow>
        </Table>

        <Table>
          <TableRow name="Created at">{createdAt && <TimestampBlock timestamp={createdAt} />}</TableRow>
        </Table>
      </div>

      <div>
        <header className={styles.adminsHeader}>
          <h3 className={styles.adminsHeading}>Admins: {admins?.length}</h3>

          <SearchForm placeholder="Search by address" onSubmit={() => {}} />
        </header>

        <List
          items={admins}
          hasMore={false}
          isLoading={false}
          noItems={{ heading: '', subheading: undefined }}
          renderItem={renderAdminCard}
          renderSkeleton={renderAdminSkeleton}
          fetchMore={() => {}}
        />
      </div>
    </div>
  );
}

export { SingleDns };
