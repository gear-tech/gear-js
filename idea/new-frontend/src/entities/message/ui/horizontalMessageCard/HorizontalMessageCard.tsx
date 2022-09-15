import { Link, generatePath } from 'react-router-dom';
import clsx from 'clsx';

import { absoluteRoutes } from 'shared/config';
import { getShortName } from 'shared/helpers';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock, BulbStatus } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import flagSVG from 'shared/assets/images/indicators/flag.svg';

import styles from './HorizontalMessageCard.module.scss';
import { IMessage } from '../../model/types';

type Props = {
  message: IMessage;
  moreInfo?: boolean;
};

const HorizontalMessageCard = ({ message, moreInfo = false }: Props) => {
  const { id: messageId, timestamp } = message;

  return (
    <article className={clsx(styles.horizontalMessageCard, moreInfo && styles.moreInfo)}>
      <IdBlock id={messageId} size="large" withIcon maxCharts={18} />
      <TimestampBlock size="medium" color="light" timestamp={timestamp} withIcon />
      {moreInfo && (
        <div className={styles.fromBlock}>
          <img src={flagSVG} alt="flag" />
          <span className={styles.text}>From program:</span>
          <BulbBlock text={getShortName(message.source)} status={BulbStatus.Success} color="light" />
        </div>
      )}
      <Link to={generatePath(absoluteRoutes.message, { messageId })} className={styles.link} />
    </article>
  );
};

export { HorizontalMessageCard };
