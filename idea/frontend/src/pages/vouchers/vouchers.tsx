import { useInfiniteQuery } from '@tanstack/react-query';

import { Placeholder } from '@/entities/placeholder';
import { IssueVoucher, VoucherCard, VoucherCardPlaceholder } from '@/features/voucher';

import { PAGE_SIZE } from './consts';
import { List } from './list';
import { Voucher } from './types';
import { getNextPageParam, getVouchers } from './utils';
import { Skeleton } from './skeleton';
import styles from './vouchers.module.scss';
import { FilterGroup, Filters, Radio, StatusCheckbox } from '@/features/filters';
import { BulbStatus } from '@/shared/ui/bulbBlock';
import { Input } from '@gear-js/ui';
import { useMemo, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import { useForm } from 'react-hook-form';

const DEFAULT_FILTER_VALUES = {
  owner: 'all',
  status: [] as ('active' | 'declined' | 'expired')[],
};

function useVoucherFilters() {
  const { account } = useAccount();
  const [values, setValues] = useState(DEFAULT_FILTER_VALUES);

  const getOwnerParams = () => {
    if (!account) return {};

    const { decodedAddress } = account;
    const { owner } = values;

    switch (owner) {
      case 'by':
        return { owner: decodedAddress };
      case 'to':
        return { spender: decodedAddress };
      default:
        return {};
    }
  };

  const getStatusParams = () => {
    const { status } = values;

    const active = status.includes('active');
    const declined = status.includes('declined');
    const expired = status.includes('expired');

    const result = {} as Record<'declined' | 'expired', boolean>;

    if (active) {
      if (declined && expired) return {};

      result.declined = false;
      result.expired = false;
    }

    if (declined) result.declined = true;
    if (expired) result.expired = true;

    return result;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params = useMemo(() => ({ ...getOwnerParams(), ...getStatusParams() }), [values, account]);

  return [values, params, setValues] as const;
}

const DEFAULT_SEARCH_VALUES = {
  query: '',
};

function useSearchQuery() {
  const [query, setQuery] = useState('');

  const { register, handleSubmit } = useForm({
    defaultValues: DEFAULT_SEARCH_VALUES,
  });

  const registerSearchInput = register('query');
  const handleSearchSubmit = handleSubmit((values) => setQuery(values.query));

  return [query, registerSearchInput, handleSearchSubmit] as const;
}

const Vouchers = () => {
  const [filterValues, filterParams, handleFiltersSubmit] = useVoucherFilters();
  const [searchQuery, registerSearchInput, handleSearchSubmit] = useSearchQuery();

  const { data, isFetching, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['vouchers', filterParams, searchQuery],
    queryFn: ({ pageParam }) => getVouchers({ limit: PAGE_SIZE, offset: pageParam, id: searchQuery, ...filterParams }),
    initialPageParam: 0,
    getNextPageParam,
  });

  const vouchers = data?.pages.flatMap((page) => page.vouchers) || [];
  const vouchersCount = data?.pages[0]?.count || 0;

  const isEmpty = !(isFetching || vouchersCount);
  const isLoaderVisible = isEmpty || (!vouchersCount && isFetching);

  const renderVoucher = ({ id, balance, amount, expiryAtBlock, expiryAt, owner, spender, isDeclined }: Voucher) => (
    <VoucherCard
      id={id}
      balance={balance}
      amount={amount}
      expirationBlock={expiryAtBlock}
      expirationTimestamp={expiryAt}
      owner={owner}
      spender={spender}
      isDeclined={isDeclined}
      onRevoke={refetch}
      onDecline={refetch}
    />
  );

  const renderSkeletonItem = () => <Skeleton SVG={VoucherCardPlaceholder} disabled={true} />;

  return (
    <div className={styles.vouchers}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Vouchers: {vouchersCount}</h2>

        <IssueVoucher onSubmit={refetch} />
      </header>

      <form onSubmit={handleSearchSubmit}>
        <Input type="search" placeholder="0x00" {...registerSearchInput} />
      </form>

      {isLoaderVisible ? (
        <div className={styles.placeholder}>
          <Placeholder
            block={renderSkeletonItem()}
            title="There are no vouchers yet"
            description="Wait until someone will issue a voucher for you"
            blocksCount={5}
            isEmpty={isEmpty}
          />
        </div>
      ) : (
        <List items={vouchers} hasNextPage={hasNextPage} renderItem={renderVoucher} fetchMore={fetchNextPage} />
      )}

      <Filters initialValues={filterValues} onSubmit={handleFiltersSubmit}>
        <FilterGroup name="owner" onSubmit={handleFiltersSubmit}>
          <Radio name="owner" value="all" label="All vouchers" onSubmit={handleFiltersSubmit} />
          <Radio name="owner" value="by" label="Issued by you" onSubmit={handleFiltersSubmit} />
          <Radio name="owner" value="to" label="Issued to you" onSubmit={handleFiltersSubmit} />
        </FilterGroup>

        <FilterGroup name="status" title="Status" onSubmit={handleFiltersSubmit} withReset>
          <StatusCheckbox
            name="status"
            value="active"
            label="Active"
            status={BulbStatus.Success}
            onSubmit={handleFiltersSubmit}
          />

          <StatusCheckbox
            name="status"
            value="declined"
            label="Declined"
            status={BulbStatus.Error}
            onSubmit={handleFiltersSubmit}
          />

          <StatusCheckbox
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
