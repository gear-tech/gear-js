import { clsx } from 'clsx';
import { useState } from 'react';

import DoubleDownSVG from '@/assets/icons/double-down.svg?react';
import { Button, Tabs, ExpandableItem } from '@/components';

import styles from './activity.module.scss';
import { Block } from './block';
import { Transaction } from './transaction';

const tabs = ['Latest activity', 'My activity'];

const Activity = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={clsx(styles.wrapper, isOpen && styles.open)}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <Tabs
            tabs={tabs}
            tabIndex={tabIndex}
            onTabIndexChange={(index) => {
              setTabIndex(index);
              setIsOpen(true);
            }}
          />
        </div>
        <Button variant="icon" onClick={() => setIsOpen((value) => !value)}>
          <DoubleDownSVG className={clsx(!isOpen && styles.iconClosed)} />
        </Button>
      </div>

      {isOpen && (
        <div className={styles.content}>
          <ExpandableItem
            header={
              <Block
                blockHash={'0xb5eb85e6e9333f75c798c71ef14fc535d2de5eccff4f5ef91bae691b31618a7e'}
                blockNumber={4400012300}
                date={Date.now()}
              />
            }>
            <Transaction />
          </ExpandableItem>
        </div>
      )}
    </div>
  );
};

export { Activity };
