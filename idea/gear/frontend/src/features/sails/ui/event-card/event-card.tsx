import { HexString } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { clsx } from 'clsx';
import { useState } from 'react';
import { generatePath } from 'react-router-dom';
import { Sails } from 'sails-js';

import { useIsVftProgram, VftEventPayload } from '@/features/vft-whitelist';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import CodeSVG from '@/shared/assets/images/actions/code.svg?react';
import { absoluteRoutes } from '@/shared/config';
import { getErrorMessage } from '@/shared/helpers';
import { PreformattedBlock, UILink } from '@/shared/ui';
import { TimestampBlock } from '@/shared/ui/timestampBlock';

import { EventType } from '../../api';
import LinkSVG from '../../assets/link.svg?react';

import styles from './event-card.module.scss';

type Props = {
  programId: HexString;
  event: EventType;
  sails: Sails | undefined;
};

function EventCard({ programId, event, sails }: Props) {
  const { service: serviceName, name, blockNumber, blockHash, payload } = event;

  const { data: isVft } = useIsVftProgram(programId);
  const isVftPayload = isVft && serviceName?.toLowerCase() === 'vft' && name;

  const [isOpen, setIsOpen] = useState(false);

  const decodePayload = () => {
    if (!sails || !serviceName || !name || !payload) return { payload };

    const service = sails.services[serviceName];

    if (!service) return { payload, error: `Sails Service '${serviceName}' is not found` };

    const serviceEvent = service.events[name];

    if (!serviceEvent) return { payload, error: `Sails Event '${name}' is not found` };

    try {
      return { payload: serviceEvent.decode(payload) as AnyJson };
    } catch (error) {
      return { payload, error: getErrorMessage(error) };
    }
  };

  const decoded = isOpen ? decodePayload() : undefined;

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <button
          type="button"
          onClick={() => setIsOpen((prevValue) => !prevValue)}
          className={clsx(styles.button, isOpen && styles.open)}>
          <span>{serviceName && name ? `${serviceName}.${name}` : serviceName || name || 'Unknown Event'}</span>

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

      {decoded && (
        <>
          {isVftPayload && !decoded.error ? (
            <VftEventPayload name={name.toLowerCase()} programId={programId} decoded={decoded.payload} />
          ) : (
            <PreformattedBlock text={decoded.payload} />
          )}

          {decoded.error && <p className={styles.error}>Can&apos;t decode payload. {decoded.error}</p>}
        </>
      )}
    </div>
  );
}

export { EventCard };
