import { CopyButton, ExpandableItem } from '@/components';

import styles from './transaction.module.scss';

const Transaction = () => {
  const params = {
    payload: 'mint (to 0xdAC17F958D2ee523a2206206994597C13D831ec7, amount: 100.)',
    value: 100000,
  };
  return (
    <ExpandableItem
      isNested
      // ! TODO:
      header={<div className={styles.transaction}>Balance transfer</div>}>
      <div className={styles.params}>
        {Object.entries(params).map(([key, value]) => (
          <div className={styles.param} key={key}>
            {key}: {value} <CopyButton value={String(value)} />
          </div>
        ))}
      </div>
    </ExpandableItem>
  );
};

export { Transaction };
