import clsx from 'clsx';
import { generatePath, Link } from 'react-router-dom';

import { getShortName } from 'shared/helpers';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock, BulbStatus } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import flagSVG from 'shared/assets/images/indicators/flag.svg';
import { ReactComponent as DirectionSVG } from 'shared/assets/images/indicators/messageDirection.svg';
import { absoluteRoutes } from 'shared/config';

import styles from './HorizontalMessageCard.module.scss';
import { IMessage } from '../../model/types';

type Props = {
  message: IMessage;
  moreInfo?: boolean;
};

const HorizontalMessageCard = ({ message, moreInfo = false }: Props) => {
  const { id: messageId, timestamp, type, program } = message;
  const { source, destination } = message;

  const isMessageFromProgram = type === 'UserMessageSent';
  const text = isMessageFromProgram ? 'From:' : 'To:';
  const addressText = isMessageFromProgram ? source : destination;

  return (
    <article className={clsx(styles.horizontalMessageCard, moreInfo && styles.moreInfo)}>
      <div className={styles.info}>
        <DirectionSVG className={clsx(styles.directionSVG, isMessageFromProgram && styles.fromProgram)} />
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
          <img src={flagSVG} alt="flag" />
          <span className={styles.text}>{text}</span>

          {program ? (
            <Link to={generatePath(absoluteRoutes.program, { programId: program.id })} className={styles.programLink}>
              <BulbBlock text={getShortName(program.name)} status={BulbStatus.Success} color="light" />
            </Link>
          ) : (
            <BulbBlock text={getShortName(addressText)} status={BulbStatus.Success} color="light" />
          )}
        </div>
      )}
    </article>
  );
};

export { HorizontalMessageCard };
