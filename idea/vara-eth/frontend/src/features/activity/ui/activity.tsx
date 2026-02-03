import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

import { myActivityAtom } from '@/app/store';
import DoubleDownSVG from '@/assets/icons/double-down.svg?react';
import { Button, Tabs, ExpandableItem } from '@/components';

import { useActivity } from '../lib';

import { ActivityEvent } from './activity-event';
import styles from './activity.module.scss';
import { Block } from './block';
import { Transaction } from './transaction';

const tabs = ['All activity', 'My activity'];

const Activity = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const activity = useActivity();
  const myActivity = useAtomValue(myActivityAtom);

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

      {isOpen && tabIndex === 0 && (
        <div className={styles.content}>
          {activity.map((item) => (
            <ExpandableItem
              key={item.blockHash}
              header={
                <Block blockHash={item.blockHash} blockNumber={Number(item.blockNumber)} timestamp={item.timestamp} />
              }>
              {item.events.map((activityEvent, index) => (
                <ActivityEvent key={index} {...activityEvent} />
              ))}
            </ExpandableItem>
          ))}
        </div>
      )}

      {isOpen && tabIndex === 1 && (
        <div className={styles.content}>
          {myActivity.map((item, index) => (
            <ExpandableItem
              key={'hash' in item ? item.hash : index}
              header={
                <Block blockHash={item.blockHash} blockNumber={Number(item.blockNumber)} timestamp={item.timestamp} />
              }>
              <Transaction item={item} />
            </ExpandableItem>
          ))}
        </div>
      )}
    </div>
  );
};

export { Activity };
