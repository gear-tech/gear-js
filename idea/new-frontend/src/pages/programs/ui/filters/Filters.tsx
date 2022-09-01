import { Input, Button, Radio, Checkbox } from '@gear-js/ui';

import { BulbBlock, BulbStatus } from 'shared/ui/bulbBlock';

import styles from './Filters.module.scss';

const Filters = () => {
  const a = 1;

  return (
    <section className={styles.filters}>
      <div className={styles.serchFieldWrapper}>
        <Input />
      </div>
      <div className={styles.filtersContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Filters</h1>
          <Button text="Clear all" color="transparent" className={styles.clearAllBtn} />
        </div>
        <div className={styles.mainFilters}>
          <div className={styles.filtersGroup}>
            <Radio label="My programs" />
            <Radio label="All programs" />
          </div>
          <div className={styles.filtersGroup}>
            <div className={styles.groupHeader}>
              <h2 className={styles.groupTitle}>Created at</h2>
            </div>
            <Input />
          </div>
          <div className={styles.filtersGroup}>
            <div className={styles.groupHeader}>
              <h2 className={styles.groupTitle}>Status</h2>
              <Button text="Clear" color="transparent" className={styles.groupClearBtn} />
            </div>
            <div className={styles.statusCheckbox}>
              <Checkbox label="" />
              <BulbBlock status={BulbStatus.Success} text="Active" />
            </div>
            <div className={styles.statusCheckbox}>
              <Checkbox label="" />
              <BulbBlock status={BulbStatus.Loading} text="Loading" className={styles.checkboxText} />
            </div>
            <div className={styles.statusCheckbox}>
              <Checkbox label="" />
              <BulbBlock status={BulbStatus.Error} text="Terminated" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Filters };
