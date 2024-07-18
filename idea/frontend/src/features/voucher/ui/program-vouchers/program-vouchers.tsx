import { HexString } from '@gear-js/api';
import { useState } from 'react';

import { isHex } from '@/shared/helpers';
import { ProgramTabLayout, SearchForm } from '@/shared/ui';

import { useVoucherFilters, useVouchers } from '../../hooks';
import { Vouchers } from '../vouchers';
import { VoucherFilters } from '../voucher-filters';

type Props = {
  programId: HexString;
};

function ProgramVouchers({ programId }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParams, handleFiltersSubmit] = useVoucherFilters();

  const [vouchers, count, isLoading, hasMore, fetchMore, refetch] = useVouchers(searchQuery, filterParams, programId);

  const renderList = () => (
    <Vouchers list={vouchers} isLoading={isLoading} hasMore={hasMore} onVoucherChange={refetch} fetchMore={fetchMore} />
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
      count={count}
      renderList={renderList}
      renderSearch={renderSearch}
      renderFilters={renderFilters}
    />
  );
}

export { ProgramVouchers };
