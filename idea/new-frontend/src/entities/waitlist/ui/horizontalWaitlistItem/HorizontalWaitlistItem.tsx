import { generatePath, Link } from 'react-router-dom';
import { Tooltip } from '@gear-js/ui';

import { IdBlock } from 'shared/ui/idBlock';
import blockSVG from 'shared/assets/images/indicators/block.svg';

import { absoluteRoutes } from 'shared/config';
import styles from './HorizontalWaitlistItem.module.scss';
import { WaitlistContent, Interval } from '../../model/types';

type Props = {
  content: WaitlistContent;
  interval: Interval;
};

const HorizontalWaitlistItem = ({ content, interval }: Props) => (
  <article className={styles.horizontalMessageCard}>
    <IdBlock id={content.message.id} size="large" withIcon maxCharts={18} />
    <span className={styles.entry}>{content.kind}</span>
    <div className={styles.interval}>
      <img src={blockSVG} alt="block" />
      <span>
        {interval.start} - {interval.finish}
      </span>
      <Tooltip text="Start block - finish block" className={styles.tooltip} />
    </div>
    <Link to={generatePath(absoluteRoutes.message, { messageId: content.message.id })} className={styles.link} />
  </article>
);

export { HorizontalWaitlistItem };
