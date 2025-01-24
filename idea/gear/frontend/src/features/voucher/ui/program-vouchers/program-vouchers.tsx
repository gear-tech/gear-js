import { HexString } from '@gear-js/api';
import { useEffect, useState } from 'react';

import { isHex } from '@/shared/helpers';
import { ProgramTabLayout, SearchForm } from '@/shared/ui';

import { useVouchers } from '../../api';
import { useVoucherFilters } from '../../hooks';
import { Vouchers } from '../vouchers';
import { VoucherFilters } from '../voucher-filters';
import { useSearchParams } from 'react-router-dom';

type Props = {
  programId: HexString;
};

function ProgramVouchers({ programId }: Props) {
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

  const [vouchers, count, isLoading, hasMore, fetchMore, refetch] = useVouchers(searchQuery, filterParams, programId);

  const renderList = () => (
    <Vouchers
      items={vouchers}
      isLoading={isLoading}
      hasMore={hasMore}
      size="small"
      onVoucherChange={refetch}
      fetchMore={fetchMore}
    />
  );

  const renderSearch = () => (
    <SearchForm
      placeholder="Search by id..."
      query={searchQuery}
      getSchema={(schema) => schema.refine((value) => isHex(value), 'Value should be hex')}
      onSubmit={(query) => setSearchQuery(query)}
    />
  );

  const renderFilters = () => (
    <VoucherFilters
      onSubmit={handleFiltersSubmit}
      values={{
        owner: filterParams.owner ? 'by' : filterParams.spender ? 'to' : 'all',
        status: filterParams.declined ? 'declined' : filterParams.expired ? 'expired' : 'active',
      }}
    />
  );

  return (
    <ProgramTabLayout
      heading="Vouchers"
      count={count}
      renderList={renderList}
      renderSearch={renderSearch}
      renderFilters={renderFilters}
    />
  );
}

export { ProgramVouchers };
