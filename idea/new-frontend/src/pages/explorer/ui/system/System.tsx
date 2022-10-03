import { Vec } from '@polkadot/types';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';

import { IdeaEvent } from 'entities/explorer';

import { BlockTablePlaceholder } from '../blockTablePlaceholder';
import { Event } from '../event';
import styles from './System.module.scss';

type Props = {
  eventRecords: Vec<FrameSystemEventRecord> | undefined;
  isLoading: boolean;
};

const System = ({ eventRecords, isLoading }: Props) => {
  const systemEvents = eventRecords
    ?.filter(({ phase }) => !phase.isApplyExtrinsic)
    .map(({ event }) => new IdeaEvent(event));

  const isAnyEvent = systemEvents && systemEvents.length > 0;

  // eslint-disable-next-line react/no-array-index-key
  const getEvents = () => systemEvents?.map((event, index) => <Event key={index} value={event} />);

  return (
    <div className={styles.system}>
      <div className={styles.header}>System events</div>
      {isLoading ? (
        <BlockTablePlaceholder />
      ) : (
        <>
          {isAnyEvent && <div>{getEvents()}</div>}
          {!isAnyEvent && <p className={styles.message}>No events available.</p>}
        </>
      )}
    </div>
  );
};

export { System };
