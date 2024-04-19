import { ReactNode } from 'react';
import SimpleBar from 'simplebar-react';

import { Observer } from './observer';
import styles from './list.module.scss';

type Props<T> = {
  items: T[];
  hasMore: boolean;
  renderItem: (item: T) => ReactNode;
  fetchMore: () => void;
};

function List<T>({ items, hasMore, renderItem, fetchMore }: Props<T>) {
  // TODO: replace key with id
  const renderItems = () => items.map((item, index) => <li key={index}>{renderItem(item)}</li>);

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
