import { EventRecords, IdeaEvent } from 'types/explorer';
import { Event } from 'pages/Explorer/common/Event/Event';
import commonStyles from '../../Block.module.scss';
import styles from './System.module.scss';

type Props = {
  eventRecords: EventRecords;
};

const System = ({ eventRecords }: Props) => {
  const systemEvents = eventRecords
    .filter(({ phase }) => !phase.isApplyExtrinsic)
    .map(({ event }) => new IdeaEvent(event));

  const isAnyEvent = systemEvents.length > 0;

  // eslint-disable-next-line react/no-array-index-key
  const getEvents = () => systemEvents.map((event, index) => <Event key={index} value={event} />);

  return (
    <div className={styles.system}>
      <div className={styles.header}>System events</div>
      {isAnyEvent ? <div>{getEvents()}</div> : <p className={commonStyles.message}>No events available.</p>}
    </div>
  );
};

export { System };
