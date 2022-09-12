import { Link } from 'react-router-dom';

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
      <IdBlock id={id} size="large" withIcon maxCharts={18} />
      <TimestampBlock size="medium" color="light" timestamp={timestamp} withIcon />
      <Link to="/" className={styles.link} />
    </article>
  );
};

export { HorizontalMessageCard };
