import cx from 'clsx';
import { generatePath } from 'react-router-dom';

import { getShortName } from '@/shared/helpers';
import { IdBlock } from '@/shared/ui/idBlock';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import FlagSVG from '@/shared/assets/images/indicators/flag.svg?react';
import DirectionSVG from '@/shared/assets/images/indicators/messageDirection.svg?react';
import { routes } from '@/shared/config';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';

import { MessageFromProgram, MessageToProgram } from '../../api';
import styles from './message-card.module.scss';

type Props = {
  isToDirection: boolean;
  message: MessageToProgram | MessageFromProgram;
};

const MessageCard = ({ isToDirection, message }: Props) => {
  const { id, timestamp, destination, source } = message;

  const isError =
    ('exitCode' in message && Boolean(message.exitCode)) ||
    ('processedWithPanic' in message && message.processedWithPanic);

  return (
    <div className={styles.card}>
      <div className={cx(styles.direction, isToDirection && styles.to)}>
        <DirectionSVG />
        <BulbBlock text="" status={isError ? BulbStatus.Error : BulbStatus.Success} />
      </div>

      <IdBlock id={id} withIcon maxCharts={18} to={generatePath(routes.message, { messageId: id })} />

      <TimestampBlock color="light" timestamp={timestamp} withIcon />

      <div className={styles.address}>
        <FlagSVG />
        <span>{isToDirection ? 'From' : 'To'}:</span>
        <span>{getShortName(isToDirection ? source : destination)}</span>
      </div>
    </div>
  );
};

export { MessageCard };
