import { AnyJson } from '@polkadot/types/types';
import clsx from 'clsx';
import { useState } from 'react';
import { generatePath } from 'react-router-dom';
import { Sails } from 'sails-js';

import { absoluteRoutes } from '@/shared/config';
import { PreformattedBlock, UILink } from '@/shared/ui';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import CodeSVG from '@/shared/assets/images/actions/code.svg?react';

import LinkSVG from '../../assets/link.svg?react';
import { EventType } from '../../api';
import { getEventMethod } from '../../utils';
import styles from './event-card.module.scss';

type Props = {
  event: EventType;
  sails: Sails | undefined;
};

function EventCard({ event, sails }: Props) {
  const { service, name, blockNumber, blockHash, payload } = event;

  const [isOpen, setIsOpen] = useState(false);

  const getDecodedPayload = () => {
    if (!sails || !service || !name || !payload) return payload;

    return sails.services[service].events[name].decode(payload) as AnyJson;
  };

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <button
          type="button"
          onClick={() => setIsOpen((prevValue) => !prevValue)}
          className={clsx(styles.button, isOpen && styles.open)}>
          <span>{getEventMethod(event)}</span>

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

      {isOpen && <PreformattedBlock text={getDecodedPayload()} />}
    </div>
  );
}

export { EventCard };
