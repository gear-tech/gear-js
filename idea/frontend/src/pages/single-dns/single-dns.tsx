import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { useParams } from 'react-router-dom';

import { useSingleDns, EditDns, DeleteDns, AdminCard, AddAdmin } from '@/features/dns';
import { IdBlock, List, SearchForm, Table, TableRow, TimestampBlock } from '@/shared/ui';

import styles from './single-dns.module.scss';

type Params = {
  address: HexString;
};

function SingleDns() {
  const { account } = useAccount();
  const { address } = useParams() as Params;

  const { data, isLoading, refetch } = useSingleDns(address);
  const { name, createdAt, admins } = data || {};

  const isAdmin = account && admins ? admins.includes(account.decodedAddress) : false;

  const renderAdminSkeleton = () => null;

  const renderAdminCard = (_address: HexString, index: number) =>
    name &&
    admins && (
      <AdminCard index={index} address={_address} name={name} admins={admins} isAdmin={isAdmin} onSuccess={refetch} />
    );

  return (
    <div className={styles.container}>
      {name && admins && (
        <header className={styles.header}>
          {/* same as in program page, maybe worth to share */}
          <h2 className={styles.heading}>{name}</h2>

          {isAdmin && (
            <div className={styles.buttons}>
              <EditDns initialValues={{ name, address }} onSuccess={refetch} />
              <DeleteDns name={name} onSuccess={refetch} />
              <AddAdmin name={name} admins={admins} onSuccess={refetch} />
            </div>
          )}
        </header>
      )}

      <div className={styles.table}>
        <Table>
          <TableRow name="Program ID">{address && <IdBlock id={address} size="big" />}</TableRow>
        </Table>

        <Table>
          <TableRow name="Created at">{createdAt && <TimestampBlock timestamp={createdAt} size="large" />}</TableRow>
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
          isLoading={isLoading}
          noItems={{ heading: 'There are no admins yet' }}
          renderItem={renderAdminCard}
          renderSkeleton={renderAdminSkeleton}
          fetchMore={() => {}}
        />
      </div>
    </div>
  );
}

export { SingleDns };
