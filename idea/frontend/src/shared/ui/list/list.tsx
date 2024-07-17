import { ReactNode } from 'react';
import SimpleBar from 'simplebar-react';

import { Observer } from './observer';
import styles from './list.module.scss';

type Item<T> = T extends (infer U)[] ? U : never;

type Props<T extends unknown[]> = {
  items: T;
  hasMore: boolean;
  renderItem: (item: Item<T>) => ReactNode;
  fetchMore: () => void;
};

function List<T extends unknown[]>({ items, hasMore, renderItem, fetchMore }: Props<T>) {
  // TODO: replace key with id
  const renderItems = () => items.map((item, index) => <li key={index}>{renderItem(item as Item<T>)}</li>);

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
