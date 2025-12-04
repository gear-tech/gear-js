import { HexString } from '@gear-js/api';
import { parseAsString } from 'nuqs';

import { useSearchParamsState } from '@/hooks';
import { isHex } from '@/shared/helpers';
import { ProgramTabLayout, SearchForm } from '@/shared/ui';

import { useVouchers } from '../../api';
import { useVoucherFilters } from '../../hooks';
import { VoucherFilters } from '../voucher-filters';
import { Vouchers } from '../vouchers';

type Props = {
  programId: HexString;
};

function ProgramVouchers({ programId }: Props) {
  const [searchQuery, setSearchQuery] = useSearchParamsState('search', parseAsString.withDefault(''));
  const [filters, filterParams, handleFiltersSubmit] = useVoucherFilters();

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
      defaultValue={searchQuery}
      getSchema={(schema) => schema.refine((value) => isHex(value), 'Value should be hex')}
      onSubmit={(query) => setSearchQuery(query)}
    />
  );

  const renderFilters = () => <VoucherFilters values={filters} onSubmit={handleFiltersSubmit} />;

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
