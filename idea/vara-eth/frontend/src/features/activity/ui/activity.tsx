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

  const handleTabChange = (value: number) => {
    setTabIndex(value);
    setIsOpen(true);
  };

  const renderActivity = () =>
    activity.map(({ blockHash, blockNumber, timestamp, events }) => (
      <ExpandableItem
        key={blockHash}
        header={<Block blockHash={blockHash} blockNumber={Number(blockNumber)} timestamp={timestamp} />}>
        {events.map((event, index) => (
          <ActivityEvent key={index} {...event} />
        ))}
      </ExpandableItem>
    ));

  const renderUserActivity = () =>
    myActivity.map((item, index) => (
      <ExpandableItem
        key={'hash' in item ? item.hash : index}
        header={<Block blockHash={item.blockHash} blockNumber={Number(item.blockNumber)} timestamp={item.timestamp} />}>
        <Transaction item={item} />
      </ExpandableItem>
    ));

  return (
    <div className={clsx(styles.wrapper, isOpen && styles.open)}>
      <header className={styles.header}>
        <Tabs tabs={tabs} tabIndex={tabIndex} onTabIndexChange={handleTabChange} className={styles.tabs} />

        <Button variant="icon" onClick={() => setIsOpen((value) => !value)}>
          <DoubleDownSVG className={clsx(!isOpen && styles.iconClosed)} />
        </Button>
      </header>

      {isOpen && tabIndex === 0 && <div className={styles.content}>{renderActivity()}</div>}
      {isOpen && tabIndex === 1 && <div className={styles.content}>{renderUserActivity()}</div>}
    </div>
  );
};

export { Activity };
