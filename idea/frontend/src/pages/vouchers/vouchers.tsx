import { isHex } from '@polkadot/util';
import { useEffect, useState } from 'react';

import {
  IssueVoucher,
  Vouchers as VouchersFeature,
  VoucherFilters,
  useVoucherFilters,
  useVouchers,
} from '@/features/voucher';
import { SearchForm } from '@/shared/ui';

import styles from './vouchers.module.scss';
import { useSearchParams } from 'react-router-dom';

const Vouchers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams, { replace: true });
  }, [searchQuery]);
  const [filterParams, handleFiltersSubmit] = useVoucherFilters();
  const [vouchers, count, isLoading, hasMore, fetchMore, refetch] = useVouchers(searchQuery, filterParams);

  return (
    <div className={styles.vouchers}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Vouchers: {count}</h2>

        <IssueVoucher onSubmit={refetch} />
      </header>

      <SearchForm
        placeholder="Search by id..."
        getSchema={(schema) => schema.refine((value) => isHex(value), 'Value should be hex')}
        query={searchQuery}
        onSubmit={(query) => setSearchQuery(query)}
      />

      <VouchersFeature
        items={vouchers}
        isLoading={isLoading}
        hasMore={hasMore}
        noItemsSubheading="Wait until someone will issue a voucher for you, or issue voucher by yourself"
        onVoucherChange={refetch}
        fetchMore={fetchMore}
      />

      <VoucherFilters
        onSubmit={handleFiltersSubmit}
        values={{
          owner: filterParams.owner ? 'by' : filterParams.spender ? 'to' : 'all',
          status: filterParams.declined ? 'declined' : filterParams.expired ? 'expired' : 'active',
        }}
      />
    </div>
  );
};

export { Vouchers };
