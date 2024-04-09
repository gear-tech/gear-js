import { useInfiniteQuery } from '@tanstack/react-query';

import { Placeholder } from '@/entities/placeholder';
import { IssueVoucher, VoucherCard, VoucherCardPlaceholder } from '@/features/voucher';
import { Subheader } from '@/shared/ui/subheader';

import { PAGE_SIZE } from './consts';
import { List } from './list';
import { Voucher } from './types';
import { getNextPageParam, getVouchers } from './utils';
import { Skeleton } from './skeleton';
import styles from './vouchers.module.scss';

const Vouchers = () => {
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['vouchers'],
    queryFn: ({ pageParam }) => getVouchers({ limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam,
  });

  const vouchers = data?.pages.flatMap((page) => page.vouchers) || [];
  const vouchersCount = data?.pages[0]?.count || 0;

  const isEmpty = !(isFetching || vouchersCount);
  const isLoaderVisible = isEmpty || (!vouchersCount && isFetching);

  const renderVoucher = ({ id, balance, amount, expiryAtBlock, expiryAt, owner, spender }: Voucher) => (
    <VoucherCard
      id={id}
      balance={balance}
      amount={amount}
      expirationBlock={expiryAtBlock}
      expirationTimestamp={expiryAt}
      owner={owner}
      spender={spender}
    />
  );

  const renderSkeletonItem = () => <Skeleton SVG={VoucherCardPlaceholder} disabled={true} />;

  return (
    <>
      <Subheader title={`Vouchers: ${vouchersCount}`} size="big">
        <IssueVoucher />
      </Subheader>

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
    </>
  );
};

export { Vouchers };
