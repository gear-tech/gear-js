import { generatePath, Link } from 'react-router-dom';
import { Tooltip } from '@gear-js/ui';

import { IdBlock } from '@/shared/ui/idBlock';
import BlockSVG from '@/shared/assets/images/indicators/block.svg?react';
import { routes } from '@/shared/config';

import { WaitlistContent, Interval } from '../../model/types';
import styles from './HorizontalWaitlistItem.module.scss';

type Props = {
  content: WaitlistContent;
  interval: Interval;
};

const HorizontalWaitlistItem = ({ content, interval }: Props) => (
  <article className={styles.horizontalMessageCard}>
    <IdBlock id={content.message.id} size="large" withIcon maxCharts={18} />
    <span className={styles.entry}>{content.kind}</span>
    <div className={styles.interval}>
      <BlockSVG />
      <span>
        {interval.start} - {interval.finish}
      </span>
      <Tooltip text="Start block - finish block" className={styles.tooltip} />
    </div>
    <Link to={generatePath(routes.message, { messageId: content.message.id })} className={styles.link} />
  </article>
);

export { HorizontalWaitlistItem };
