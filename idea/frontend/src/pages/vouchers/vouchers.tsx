import { useAccount } from '@gear-js/react-hooks';
import { isHex } from '@polkadot/util';
import { useState } from 'react';

import { Placeholder } from '@/entities/placeholder';
import {
  IssueVoucher,
  Voucher,
  VoucherCard,
  VoucherCardPlaceholder,
  useVoucherFilters,
  useVouchers,
} from '@/features/voucher';
import { FilterGroup, Filters, Radio, StatusRadio } from '@/features/filters';
import { BulbStatus } from '@/shared/ui/bulbBlock';
import { List, SearchForm, Skeleton } from '@/shared/ui';

import styles from './vouchers.module.scss';

const Vouchers = () => {
  const { account } = useAccount();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, filterParams, handleFiltersSubmit] = useVoucherFilters();
  const [vouchers, count, isLoading, hasMore, fetchMore, refetch] = useVouchers(searchQuery, filterParams);

  const isEmpty = !(isLoading || count);
  const isLoaderVisible = isEmpty || (!count && isLoading);

  const renderVoucher = (voucher: Voucher) => <VoucherCard voucher={voucher} onChange={refetch} />;
  const renderSkeleton = () => <Skeleton SVG={VoucherCardPlaceholder} disabled={true} />;

  return (
    <div className={styles.vouchers}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Vouchers: {count}</h2>

        <IssueVoucher onSubmit={refetch} />
      </header>

      <SearchForm
        placeholder="Search by id..."
        getSchema={(schema) => schema.refine((value) => isHex(value), 'Value should be hex')}
        onSubmit={(query) => setSearchQuery(query)}
      />

      {isLoaderVisible ? (
        <div className={styles.placeholder}>
          <Placeholder
            block={renderSkeleton()}
            title="There are no vouchers yet"
            description="Wait until someone will issue a voucher for you, or issue voucher by yourself"
            blocksCount={5}
            isEmpty={isEmpty}
          />
        </div>
      ) : (
        <List items={vouchers} hasMore={hasMore} renderItem={renderVoucher} fetchMore={fetchMore} />
      )}

      <Filters initialValues={filterValues} onSubmit={handleFiltersSubmit}>
        <FilterGroup name="owner" onSubmit={handleFiltersSubmit}>
          <Radio name="owner" value="all" label="All vouchers" onSubmit={handleFiltersSubmit} />

          {account && (
            <>
              <Radio name="owner" value="by" label="Issued by you" onSubmit={handleFiltersSubmit} />
              <Radio name="owner" value="to" label="Issued to you" onSubmit={handleFiltersSubmit} />
            </>
          )}
        </FilterGroup>

        <FilterGroup name="status" title="Status" onSubmit={handleFiltersSubmit} withReset>
          <StatusRadio
            name="status"
            value="active"
            label="Active"
            status={BulbStatus.Success}
            onSubmit={handleFiltersSubmit}
          />

          <StatusRadio
            name="status"
            value="declined"
            label="Declined"
            status={BulbStatus.Error}
            onSubmit={handleFiltersSubmit}
          />

          <StatusRadio
            name="status"
            value="expired"
            label="Expired"
            status={BulbStatus.Exited}
            onSubmit={handleFiltersSubmit}
          />
        </FilterGroup>
      </Filters>
    </div>
  );
};

export { Vouchers };
