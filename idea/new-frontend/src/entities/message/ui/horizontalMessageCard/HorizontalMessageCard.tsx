import { IdBlock } from 'shared/ui/idBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';

import styles from './HorizontalMessageCard.module.scss';
import { IMessage } from '../../model/types';

type Props = {
  message: IMessage;
};

const HorizontalMessageCard = ({ message }: Props) => {
  const { id, timestamp } = message;

  return (
    <article className={styles.horizontalMessageCard}>
      <IdBlock id={id} size="medium" withIcon />
      <TimestampBlock timestamp={timestamp} withIcon />
    </article>
  );
};

export { HorizontalMessageCard };
