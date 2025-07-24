import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

import { myActivityAtom } from '@/app/store';
import DoubleDownSVG from '@/assets/icons/double-down.svg?react';
import { Button, Tabs, ExpandableItem } from '@/components';

import { useAllActivity } from '../lib';

import { ActivityEvent } from './activity-event';
import styles from './activity.module.scss';
import { Block } from './block';
import { Transaction } from './transaction';

const tabs = ['Latest activity', 'My activity'];

const Activity = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const myActivity = useAtomValue(myActivityAtom);
  const allActivity = useAllActivity();

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
          {allActivity.map((activity) => (
            <ExpandableItem
              key={activity.blockHash}
              header={
                <Block
                  blockHash={activity.blockHash}
                  blockNumber={activity.blockNumber}
                  timestamp={activity.timestamp}
                />
              }>
              {activity.events.map((activityEvent, index) => (
                <ActivityEvent key={index} item={activityEvent} />
              ))}
            </ExpandableItem>
          ))}
        </div>
      )}

      {isOpen && tabIndex === 1 && (
        <div className={styles.content}>
          {myActivity.map((activity, index) => (
            <ExpandableItem
              key={activity.hash || index}
              header={
                <Block
                  // ! TODO: remove empty string and 0
                  blockHash={activity.blockHash || ''}
                  blockNumber={activity.blockNumber || 0}
                  timestamp={activity.timestamp}
                />
              }>
              <Transaction item={activity} />
            </ExpandableItem>
          ))}
        </div>
      )}
    </div>
  );
};

export { Activity };
