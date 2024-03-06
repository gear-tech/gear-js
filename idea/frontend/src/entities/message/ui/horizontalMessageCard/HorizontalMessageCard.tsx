import clsx from 'clsx';
import { generatePath, Link } from 'react-router-dom';

import { getShortName } from '@/shared/helpers';
import { IdBlock } from '@/shared/ui/idBlock';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import FlagSVG from '@/shared/assets/images/indicators/flag.svg?react';
import DirectionSVG from '@/shared/assets/images/indicators/messageDirection.svg?react';
import { absoluteRoutes } from '@/shared/config';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';
import { IProgram } from '@/features/program';

import { IMessage } from '../../model/types';

import styles from './HorizontalMessageCard.module.scss';

type Props = {
  message: IMessage;
  program?: Pick<IProgram, 'id' | 'name'>;
};

const HorizontalMessageCard = ({ message, program }: Props) => {
  const { id: messageId, timestamp, type, exitCode } = message;

  const isMessageFromProgram = type === 'UserMessageSent';

  return (
    <article className={clsx(styles.horizontalMessageCard, program && styles.moreInfo)}>
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

      {program && (
        <div className={styles.fromBlock}>
          <div className={styles.fromIcon}>
            <FlagSVG />
            <span className={styles.text}>{isMessageFromProgram ? 'From:' : 'To:'}</span>
          </div>

          <Link to={generatePath(absoluteRoutes.program, { programId: program.id })} className={styles.programLink}>
            {getShortName(program.name)}
          </Link>
        </div>
      )}
    </article>
  );
};

export { HorizontalMessageCard };
