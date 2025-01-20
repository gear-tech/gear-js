import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useSingleDns, EditDns, DeleteDns, AdminCard, AddAdmin } from '@/features/dns';
import { IdBlock, List, SearchForm, Skeleton, Table, TableRow, TimestampBlock } from '@/shared/ui';
import { ACCOUNT_ADDRESS_SCHEMA } from '@/shared/config';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';

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

  const [searchQuery, setSearchQuery] = useState('');
  const searchedAdmins = admins?.filter((admin) => admin.includes(searchQuery));

  const renderAdminSkeleton = () => <Skeleton SVG={CardPlaceholderSVG} disabled />;

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
        {address && createdAt ? (
          <>
            <Table>
              <TableRow name="Program ID">
                <IdBlock id={address} size="big" />
              </TableRow>
            </Table>

            <Table>
              <TableRow name="Created at">
                <TimestampBlock timestamp={createdAt} size="large" />
              </TableRow>
            </Table>
          </>
        ) : (
          <>
            <Skeleton SVG={CardPlaceholderSVG} />
            <Skeleton SVG={CardPlaceholderSVG} />
          </>
        )}
      </div>

      <div>
        <header className={styles.adminsHeader}>
          <h3 className={styles.adminsHeading}>Admins: {searchedAdmins?.length}</h3>

          <SearchForm
            placeholder="Search by address"
            onSubmit={setSearchQuery}
            getSchema={() => ACCOUNT_ADDRESS_SCHEMA}
            disabled={isLoading}
          />
        </header>

        <List
          items={searchedAdmins}
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
