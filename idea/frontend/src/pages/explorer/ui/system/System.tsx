import { Vec } from '@polkadot/types';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';

import { IdeaEvent } from 'entities/explorer';
import { Placeholder } from 'entities/placeholder';
import { ReactComponent as EventPlaceholderSVG } from 'shared/assets/images/placeholders/eventPlaceholder.svg';

import { Event } from '../event';
import styles from './System.module.scss';

type Props = {
  eventRecords: Vec<FrameSystemEventRecord> | undefined;
  isError: boolean;
};

const System = ({ eventRecords, isError }: Props) => {
  const systemEvents = eventRecords
    ?.filter(({ phase }) => !phase.isApplyExtrinsic)
    .map(({ event }) => new IdeaEvent(event));

  // eslint-disable-next-line react/no-array-index-key
  const getEvents = () => systemEvents?.map((event, index) => <Event key={index} value={event} />);

  const isAnyEvent = systemEvents && systemEvents.length > 0;
  const isListEmpty = systemEvents?.length === 0;

  return (
    <div>
      <div className={styles.header}>System events</div>
      <div className={styles.main}>
        {isAnyEvent ? (
          getEvents()
        ) : (
          <Placeholder
            block={<EventPlaceholderSVG />}
            title={isError ? '' : 'No system events'}
            isEmpty={isListEmpty || isError}
            blocksCount={2}
          />
        )}
      </div>
    </div>
  );
};

export { System };
