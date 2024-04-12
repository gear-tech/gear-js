import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';

import { Placeholder } from '@/entities/placeholder';
import { IssueVoucher, VoucherCard, VoucherCardPlaceholder } from '@/features/voucher';
import { FilterGroup, Filters, Radio, StatusRadio } from '@/features/filters';
import { BulbStatus } from '@/shared/ui/bulbBlock';

import { Voucher } from './types';
import { useVoucherFilters, useVouchers } from './hooks';
import { List } from './list';
import { SearchForm } from './search-form';
import { Skeleton } from './skeleton';
import styles from './vouchers.module.scss';

const Vouchers = () => {
  const { account } = useAccount();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, filterParams, handleFiltersSubmit] = useVoucherFilters();
  const [vouchers, count, isLoading, hasMore, fetchMore, refetch] = useVouchers(searchQuery, filterParams);

  const isEmpty = !(isLoading || count);
  const isLoaderVisible = isEmpty || (!count && isLoading);

  const renderVoucher = (voucher: Voucher) => <VoucherCard voucher={voucher} onRevoke={refetch} onDecline={refetch} />;
  const renderSkeleton = () => <Skeleton SVG={VoucherCardPlaceholder} disabled={true} />;

  return (
    <div className={styles.vouchers}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Vouchers: {count}</h2>

        <IssueVoucher onSubmit={refetch} />
      </header>

      <SearchForm onSubmit={setSearchQuery} />

      {isLoaderVisible ? (
        <div className={styles.placeholder}>
          <Placeholder
            block={renderSkeleton()}
            title="There are no vouchers yet"
            description="Wait until someone will issue a voucher for you"
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
