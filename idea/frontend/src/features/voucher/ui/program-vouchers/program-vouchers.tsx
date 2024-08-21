import { HexString } from '@gear-js/api';
import { useState } from 'react';

import { isHex } from '@/shared/helpers';
import { ProgramTabLayout, SearchForm } from '@/shared/ui';

import { useVouchers } from '../../api';
import { useVoucherFilters } from '../../hooks';
import { Vouchers } from '../vouchers';
import { VoucherFilters } from '../voucher-filters';

type Props = {
  programId: HexString;
};

function ProgramVouchers({ programId }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParams, handleFiltersSubmit] = useVoucherFilters();

  const { data, isLoading, hasNextPage, refetch, fetchNextPage } = useVouchers({
    id: searchQuery as HexString,
    programs: [programId],
    ...filterParams,
  });

  const renderList = () => (
    <Vouchers
      items={data?.vouchers}
      isLoading={isLoading}
      hasMore={hasNextPage}
      size="small"
      onVoucherChange={refetch}
      fetchMore={fetchNextPage}
    />
  );

  const renderSearch = () => (
    <SearchForm
      placeholder="Search by id..."
      getSchema={(schema) => schema.refine((value) => isHex(value), 'Value should be hex')}
      onSubmit={(query) => setSearchQuery(query)}
    />
  );

  const renderFilters = () => <VoucherFilters onSubmit={handleFiltersSubmit} />;

  return (
    <ProgramTabLayout
      heading="Vouchers"
      count={data?.count}
      renderList={renderList}
      renderSearch={renderSearch}
      renderFilters={renderFilters}
    />
  );
}

export { ProgramVouchers };
