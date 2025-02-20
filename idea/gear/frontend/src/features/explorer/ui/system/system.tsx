import { Vec } from '@polkadot/types';
import { EventRecord } from '@polkadot/types/interfaces';

import { Placeholder } from '@/entities/placeholder';
import { IdeaEvent } from '@/features/explorer';
import EventPlaceholderSVG from '@/shared/assets/images/placeholders/eventPlaceholder.svg?react';

import { Event } from '../event';

import styles from './system.module.scss';

type Props = {
  eventRecords: Vec<EventRecord> | undefined;
  isError: boolean;
};

const System = ({ eventRecords, isError }: Props) => {
  const systemEvents = eventRecords
    ?.filter(({ phase }) => !phase.isApplyExtrinsic)
    .map(({ event }) => new IdeaEvent(event));

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
