import clsx from 'clsx';
import { generatePath, Link } from 'react-router-dom';

import { Message } from '@/features/message';
import { getShortName } from '@/shared/helpers';
import { IdBlock } from '@/shared/ui/idBlock';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import FlagSVG from '@/shared/assets/images/indicators/flag.svg?react';
import DirectionSVG from '@/shared/assets/images/indicators/messageDirection.svg?react';
import { absoluteRoutes, routes } from '@/shared/config';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';

import styles from './message-card.module.scss';
import { HexString } from '@gear-js/api';

type Props = {
  message: Message;
  program?: { id: HexString; name: string | undefined };
};

const MessageCard = ({ message, program }: Props) => {
  const { id: messageId, timestamp, type, exitCode } = message;
  const isUserMessageSent = type === 'UserMessageSent';

  return (
    <article className={clsx(styles.horizontalMessageCard, program && styles.moreInfo)}>
      <div className={styles.info}>
        <DirectionSVG className={clsx(styles.directionSVG, isUserMessageSent && styles.fromDirection)} />
        <BulbBlock text="" status={exitCode ? BulbStatus.Error : BulbStatus.Success} />
        <IdBlock id={messageId} size="large" withIcon maxCharts={18} to={generatePath(routes.message, { messageId })} />
      </div>

      <TimestampBlock size="medium" color="light" timestamp={timestamp} withIcon />

      {program && (
        <div className={styles.fromBlock}>
          <div className={styles.fromIcon}>
            <FlagSVG />
            <span className={styles.text}>{isUserMessageSent ? 'From:' : 'To:'}</span>
          </div>

          {/* if there's no name, message is not from a program */}
          {/* think about more straightforward logic and naming */}
          {program.name ? (
            <Link to={generatePath(absoluteRoutes.program, { programId: program.id })} className={styles.programLink}>
              {getShortName(program.name)}
            </Link>
          ) : (
            <p className={styles.text}>{getShortName(program.id)}</p>
          )}
        </div>
      )}
    </article>
  );
};

export { MessageCard };
