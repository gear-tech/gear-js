import cx from 'clsx';
import { generatePath, Link } from 'react-router-dom';

import { IdBlock } from '@/shared/ui/idBlock';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import DirectionSVG from '@/shared/assets/images/indicators/messageDirection.svg?react';
import { routes } from '@/shared/config';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';

import { MessageFromProgram, MessageToProgram } from '../../api';
import { isMessageWithError } from '../../utils';
import styles from './message-card.module.scss';

type Props = {
  isToDirection: boolean;
  message: MessageToProgram | MessageFromProgram;
};

const MessageCard = ({ isToDirection, message }: Props) => {
  const { id, timestamp, service, fn } = message;

  const hasName = Boolean(service || fn);
  const to = generatePath(routes.message, { messageId: id });

  return (
    <div className={styles.card}>
      <div className={cx(styles.direction, isToDirection && styles.to)}>
        <DirectionSVG />
        <BulbBlock text="" status={isMessageWithError(message) ? BulbStatus.Error : BulbStatus.Success} />
      </div>

      {hasName && (
        <Link to={to} className={styles.name}>
          {service && fn ? `${service}.${fn}` : service || fn}
        </Link>
      )}

      <IdBlock id={id} withIcon maxCharts={18} color={hasName ? 'light' : undefined} to={!hasName ? to : undefined} />

      <TimestampBlock color="light" timestamp={timestamp} withIcon />
    </div>
  );
};

export { MessageCard };
