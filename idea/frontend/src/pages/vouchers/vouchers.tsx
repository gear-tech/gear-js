import { Input } from '@gear-js/ui';
import { useInfiniteQuery } from '@tanstack/react-query';

import { Placeholder } from '@/entities/placeholder';
import { IssueVoucher, VoucherCard, VoucherCardPlaceholder } from '@/features/voucher';
import { FilterGroup, Filters, Radio, StatusCheckbox } from '@/features/filters';
import { BulbStatus } from '@/shared/ui/bulbBlock';

import { PAGE_SIZE } from './consts';
import { List } from './list';
import { Voucher } from './types';
import { getNextPageParam, getVouchers } from './utils';
import { Skeleton } from './skeleton';
import { useSearchQuery, useVoucherFilters } from './hooks';
import styles from './vouchers.module.scss';

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
