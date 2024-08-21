import { HexString } from '@gear-js/api';
import { isHex } from '@polkadot/util';
import { useState } from 'react';

import {
  IssueVoucher,
  Vouchers as VouchersFeature,
  VoucherFilters,
  useVoucherFilters,
  useVouchers,
} from '@/features/voucher';
import { SearchForm } from '@/shared/ui';

import styles from './vouchers.module.scss';

const Vouchers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParams, handleFiltersSubmit] = useVoucherFilters();
  const [vouchers, count, isLoading, hasMore, fetchMore, refetch] = useVouchers({
    id: searchQuery as HexString,
    ...filterParams,
  });

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

      <VouchersFeature
        items={vouchers}
        isLoading={isLoading}
        hasMore={hasMore}
        noItemsSubheading="Wait until someone will issue a voucher for you, or issue voucher by yourself"
        onVoucherChange={refetch}
        fetchMore={fetchMore}
      />

      <VoucherFilters onSubmit={handleFiltersSubmit} />
    </div>
  );
};

export { Vouchers };
