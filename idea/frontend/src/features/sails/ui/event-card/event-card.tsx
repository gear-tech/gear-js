import clsx from 'clsx';
import { useState } from 'react';
import { generatePath } from 'react-router-dom';

import { absoluteRoutes } from '@/shared/config';
import { PreformattedBlock, UILink } from '@/shared/ui';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import CodeSVG from '@/shared/assets/images/actions/code.svg?react';

import LinkSVG from '../../assets/link.svg?react';
import { EventType } from '../../api';
import styles from './event-card.module.scss';

function EventCard({ event }: { event: EventType }) {
  const { service, name, blockNumber, blockHash, payload } = event;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <button
          type="button"
          onClick={() => setIsOpen((prevValue) => !prevValue)}
          className={clsx(styles.button, isOpen && styles.open)}>
          <span>
            {service || 'service'}.{name || 'name'}
          </span>

          <ArrowSVG />
        </button>

        <div className={styles.props}>
          <TimestampBlock timestamp={event.timestamp} withIcon />

          <div className={styles.blockhash}>
            <CodeSVG className={styles.codeSVG} />
            <span>{blockNumber}</span>

            <UILink
              icon={LinkSVG}
              color="transparent"
              to={generatePath(absoluteRoutes.block, { blockId: blockHash })}
            />
          </div>
        </div>
      </header>

      {isOpen && <PreformattedBlock text={payload} />}
    </div>
  );
}

export { EventCard };
