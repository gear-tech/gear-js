import cx from 'clsx';
import { generatePath } from 'react-router-dom';

import { IdBlock } from '@/shared/ui/idBlock';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import FlagSVG from '@/shared/assets/images/indicators/flag.svg?react';
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

  return (
    <div className={styles.card}>
      <div className={cx(styles.direction, isToDirection && styles.to)}>
        <DirectionSVG />
        <BulbBlock text="" status={isMessageWithError(message) ? BulbStatus.Error : BulbStatus.Success} />
      </div>

      <IdBlock id={id} withIcon maxCharts={18} to={generatePath(routes.message, { messageId: id })} />

      <TimestampBlock color="light" timestamp={timestamp} withIcon />

      {(service || fn) && (
        <div className={styles.service}>
          <FlagSVG />

          <span>{service && fn ? `${service}.${fn}` : service || fn}</span>
        </div>
      )}
    </div>
  );
};

export { MessageCard };
