import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';

import { type MyActivity, myActivityAtom, TransactionTypes } from '@/app/store';
import DoubleDownSVG from '@/assets/icons/double-down.svg?react';
import { Button, ExpandableItem, Tabs } from '@/components';
import { formatDate } from '@/shared/utils';

import { useActivity } from '../lib';
import styles from './activity.module.scss';
import { ActivityEvent } from './activity-event';
import { Block } from './block';
import { Transaction } from './transaction';

const tabs = ['All activity', 'My activity'];
const NEW_ITEM_HIGHLIGHT_DURATION = 1800;

type HighlightType = 'success' | 'error';

const Activity = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [highlightedItems, setHighlightedItems] = useState<Record<string, HighlightType>>({});
  const seenItemsRef = useRef(new Set<string>());
  const hasInitializedActivityRef = useRef(false);
  const timersRef = useRef<Set<number>>(new Set());

  const activity = useActivity();
  const myActivity = useAtomValue(myActivityAtom);

  const myActivityItems = useMemo(
    () =>
      myActivity.map((item) => {
        const key = getUserActivityKey(item);
        return { item, key, hasError: isActivityError(item) };
      }),
    [myActivity],
  );

  useEffect(() => {
    let hasNewActivityItem = false;
    const newHighlights: Record<string, HighlightType> = {};

    for (const { key, hasError } of myActivityItems) {
      if (seenItemsRef.current.has(key)) continue;

      seenItemsRef.current.add(key);
      hasNewActivityItem = true;
      newHighlights[key] = hasError ? 'error' : 'success';

      const timerId = window.setTimeout(() => {
        setHighlightedItems((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        timersRef.current.delete(timerId);
      }, NEW_ITEM_HIGHLIGHT_DURATION);

      timersRef.current.add(timerId);
    }

    if (Object.keys(newHighlights).length > 0) {
      setHighlightedItems((prev) => ({ ...prev, ...newHighlights }));
    }

    if (!hasInitializedActivityRef.current) {
      hasInitializedActivityRef.current = true;
      return;
    }

    if (hasNewActivityItem) {
      setTabIndex(1);
      setIsOpen(true);
    }
  }, [myActivityItems]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      timersRef.current.clear();
    },
    [],
  );

  useEffect(() => {
    if (myActivity.length > 0) return;

    seenItemsRef.current.clear();
    setHighlightedItems({});
  }, [myActivity.length]);

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
    myActivityItems.map(({ item, key }) => (
      <ExpandableItem
        key={key}
        className={clsx(
          styles.activityItem,
          highlightedItems[key] === 'success' && styles.activityItemHighlightSuccess,
          highlightedItems[key] === 'error' && styles.activityItemHighlightError,
        )}
        defaultOpen
        header={<MyActivityHeader item={item} />}>
        <Transaction item={item} isMyActivity />
      </ExpandableItem>
    ));

  return (
    <div className={clsx(styles.wrapper, isOpen && styles.open)}>
      <header className={styles.header}>
        <Tabs tabs={tabs} tabIndex={tabIndex} onTabIndexChange={handleTabChange} className={styles.tabs} />

        <Button variant="icon" onClick={() => setIsOpen((prevValue) => !prevValue)}>
          <DoubleDownSVG className={clsx(!isOpen && styles.iconClosed)} />
        </Button>
      </header>

      {isOpen && tabIndex === 0 && <div className={styles.content}>{renderActivity()}</div>}
      {isOpen && tabIndex === 1 && (
        <div className={clsx(styles.content, styles.myActivityContent)}>{renderUserActivity()}</div>
      )}
    </div>
  );
};

const MyActivityHeader = ({ item }: { item: MyActivity & { timestamp: number } }) => (
  <div className={styles.myActivityHeader}>
    <div className={styles.actionText}>{getActionLabel(item)}</div>
    <div className={styles.actionTime}>{formatDate(item.timestamp)}</div>
  </div>
);

const getActionLabel = (item: MyActivity) => {
  switch (item.type) {
    case TransactionTypes.codeValidation:
      return 'Validate code';
    case TransactionTypes.createProgram:
      return 'Create program';
    case TransactionTypes.executableBalanceTopUp:
      return 'Top up executable balance';
    case TransactionTypes.approve:
      return 'Approve WVARA';
    case TransactionTypes.programMessage:
      return `Send message ${item.serviceName}.${item.messageName}`;
    case TransactionTypes.programReply:
      return `Receive reply ${item.serviceName}.${item.messageName}`;
    case TransactionTypes.readProgramReply:
      return `Read ${item.serviceName}.${item.messageName}`;
    case TransactionTypes.initProgram:
      return 'Init program';
    case TransactionTypes.injectedTx:
      return `Send injected tx ${item.serviceName}.${item.messageName}`;
    case TransactionTypes.injectedTxResponse:
      return `Receive injected tx response ${item.serviceName}.${item.messageName}`;
    default:
      return 'Unknown action';
  }
};

const getUserActivityKey = (item: MyActivity & { timestamp: number; blockHash: string }) => {
  const hashPart = 'hash' in item ? item.hash : '';
  const participantPart = 'to' in item && item.to ? item.to : 'from' in item ? item.from : '';
  const targetPart = 'programId' in item ? item.programId : '';
  const valuePart = 'value' in item ? item.value : '';

  return `${item.timestamp}-${item.type}-${item.blockHash}-${hashPart}-${participantPart}-${targetPart}-${valuePart}`;
};

const isActivityError = (item: MyActivity) => {
  if ('error' in item && Boolean(item.error)) return true;
  if ('resultStatus' in item && item.resultStatus === 'error') return true;
  if ('replyCode' in item && typeof item.replyCode === 'string') {
    const normalizedReplyCode = item.replyCode.toLowerCase();
    return normalizedReplyCode.includes('error') || normalizedReplyCode.includes('fail');
  }
  return false;
};

export { Activity };
