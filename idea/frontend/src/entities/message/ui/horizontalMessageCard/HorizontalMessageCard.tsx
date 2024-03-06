import clsx from 'clsx';
import { generatePath, Link } from 'react-router-dom';

import { getShortName } from '@/shared/helpers';
import { IdBlock } from '@/shared/ui/idBlock';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import FlagSVG from '@/shared/assets/images/indicators/flag.svg?react';
import DirectionSVG from '@/shared/assets/images/indicators/messageDirection.svg?react';
import { absoluteRoutes } from '@/shared/config';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';

import styles from './HorizontalMessageCard.module.scss';
import { IMessage } from '../../model/types';

type Props = {
  message: IMessage;
  moreInfo?: boolean;
};

const HorizontalMessageCard = ({ message, moreInfo = false }: Props) => {
  // TODO: backend
  const program = { name: '0x01', id: '0x01' };

  const { id: messageId, timestamp, type, exitCode } = message;
  const { source, destination } = message;

  const isMessageFromProgram = type === 'UserMessageSent';
  const text = isMessageFromProgram ? 'From:' : 'To:';
  const addressText = isMessageFromProgram ? source : destination;

  return (
    <article className={clsx(styles.horizontalMessageCard, moreInfo && styles.moreInfo)}>
      <div className={styles.info}>
        <DirectionSVG className={clsx(styles.directionSVG, isMessageFromProgram && styles.fromProgram)} />
        <BulbBlock text="" status={exitCode ? BulbStatus.Error : BulbStatus.Success} />
        <IdBlock
          id={messageId}
          size="large"
          withIcon
          maxCharts={18}
          to={generatePath(absoluteRoutes.message, { messageId })}
        />
      </div>

      <TimestampBlock size="medium" color="light" timestamp={timestamp} withIcon />
      {moreInfo && (
        <div className={styles.fromBlock}>
          <div className={styles.fromIcon}>
            <FlagSVG />
            <span className={styles.text}>{text}</span>
          </div>

          {program ? (
            <Link to={generatePath(absoluteRoutes.program, { programId: program.id })} className={styles.programLink}>
              {getShortName(program.name)}
            </Link>
          ) : (
            <p className={styles.text}>{getShortName(addressText)}</p>
          )}
        </div>
      )}
    </article>
  );
};

export { HorizontalMessageCard };
