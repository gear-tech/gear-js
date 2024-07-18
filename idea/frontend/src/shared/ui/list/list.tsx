import { ReactNode } from 'react';
import SimpleBar from 'simplebar-react';

import { Placeholder } from '@/entities/placeholder';

import { Observer } from './observer';
import styles from './list.module.scss';

type Item<T> = T extends (infer U)[] ? U : never;

type Props<T extends unknown[]> = {
  items: T | undefined;
  hasMore: boolean;
  isLoading: boolean;
  renderItem: (item: Item<T>) => ReactNode;
  fetchMore: () => void;
  renderSkeleton: () => ReactNode;
};

function List<T extends unknown[]>({ items, hasMore, isLoading, renderItem, fetchMore, renderSkeleton }: Props<T>) {
  // TODO: replace key with id
  const renderItems = () => items?.map((item, index) => <li key={index}>{renderItem(item as Item<T>)}</li>);

  const count = items?.length;
  const isEmpty = !isLoading && !count;

  if (isLoading || isEmpty)
    return (
      <div className={styles.placeholder}>
        <Placeholder
          block={renderSkeleton()}
          title="There are no vouchers yet"
          description="Wait until someone will issue a voucher for you, or issue voucher by yourself"
          blocksCount={5}
          isEmpty={isEmpty}
        />
      </div>
    );

  return (
    // TODO: add loading and empty states,
    // TODO: replace simplebar with css?
    <SimpleBar className={styles.simplebar}>
      <ul className={styles.list}>{renderItems()}</ul>

      {hasMore && <Observer onIntersection={fetchMore} />}
    </SimpleBar>
  );
}

export { List };
