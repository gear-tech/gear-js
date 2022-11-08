import { ReactComponent as EventPlaceholderSVG } from 'shared/assets/images/placeholders/eventPlaceholder.svg';
import { Placeholder } from 'entities/placeholder';

import styles from './EventsPlaceholder.module.scss';

type Props = {
  isEmpty: boolean;
};

const EventsPlaceholder = ({ isEmpty }: Props) => (
  <div className={styles.placeholder}>
    <Placeholder
      block={<EventPlaceholderSVG />}
      title="There is no events yet"
      description="The list is empty while there are no events"
      isEmpty={isEmpty}
      blocksCount={5}
    />
  </div>
);

export { EventsPlaceholder };
