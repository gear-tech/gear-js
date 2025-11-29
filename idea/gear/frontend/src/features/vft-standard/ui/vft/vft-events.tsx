import { HexString } from '@gear-js/api';
import { Identicon } from '@polkadot/react-identicon';
import { JSX } from 'react';
import { Sails } from 'sails-js';

import { EventType, useEvents } from '@/features/sails/api';
import { getShortName, isUndefined } from '@/shared/helpers';
import { Box } from '@/shared/ui';

import { useVftDecimals } from '../../hooks';
import { Vft } from '../../sails';

import styles from './vft-events.module.scss';

function formatUnits(value: bigint | string, decimals: number): string {
  const bigIntValue = typeof value === 'string' ? BigInt(value) : value;

  if (decimals === 0) {
    return bigIntValue.toString();
  }

  const divisor = 10n ** BigInt(decimals);
  const integerPart = bigIntValue / divisor;
  const fractionalPart = bigIntValue % divisor;

  if (fractionalPart === 0n) {
    return integerPart.toString();
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');

  return `${integerPart}.${trimmedFractional}`;
}

type Props = {
  id: HexString | undefined;
  sails: Sails | undefined;
};

type TransferPayload = Parameters<Parameters<Vft['subscribeToTransferEvent']>[0]>[0];
type MintPayload = Parameters<Parameters<Vft['subscribeToMintedEvent']>[0]>[0];
type BurnPayload = Parameters<Parameters<Vft['subscribeToBurnedEvent']>[0]>[0];
type ApprovePayload = Parameters<Parameters<Vft['subscribeToApprovalEvent']>[0]>[0];

type EventListProps<T> = {
  title: string;
  events: EventType[] | undefined;
  eventName: string;
  sails: Sails;
  renderPayload: (payload: T) => JSX.Element;
};

function EventList<T>({ title, events, eventName, sails, renderPayload }: EventListProps<T>) {
  if (!events) return null;

  const getDecodedPayload = (payload: HexString) => {
    return sails.services['Vft'].events[eventName].decode(payload) as T;
  };

  const renderEvents = () => {
    if (events.length === 0) {
      return <li className={styles.emptyState}>No events yet</li>;
    }

    return events.map(({ payload, ...event }) => {
      const decodedPayload = getDecodedPayload(payload!);

      return (
        <li key={event.id} className={styles.eventItem}>
          <header className={styles.eventHeader}>
            <h4 className={styles.eventName}>{eventName.charAt(0).toUpperCase() + eventName.slice(1)}</h4>

            <p className={styles.eventMeta}>
              <span className={styles.timestamp}>{new Date(event.timestamp).toLocaleString()}</span>
              <span className={styles.blockNumber}>#{event.blockNumber}</span>
            </p>
          </header>

          <div className={styles.eventPayload}>{renderPayload(decodedPayload)}</div>
        </li>
      );
    });
  };

  return (
    <Box className={styles.eventCard}>
      <h3 className={styles.eventTitle}>{title}</h3>
      <ul className={styles.eventList}>{renderEvents()}</ul>
    </Box>
  );
}

function VftEvents({ id, sails }: Props) {
  const { data: decimals } = useVftDecimals(id);

  const transfers = useEvents({ service: 'vft', name: 'transfer', source: id });
  const mints = useEvents({ service: 'vft', name: 'mint', source: id });
  const burns = useEvents({ service: 'vft', name: 'burn', source: id });
  const approvals = useEvents({ service: 'vft', name: 'approval', source: id });

  if (!sails || isUndefined(decimals)) return;

  const renderTransferPayload = (payload: TransferPayload) => {
    return (
      <>
        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>From:</span>

          <span className={styles.payloadValue}>
            <Identicon value={payload.from} theme="polkadot" size={16} />
            {getShortName(payload.from, 12)}
          </span>
        </div>

        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>To:</span>

          <span className={styles.payloadValue}>
            <Identicon value={payload.to} theme="polkadot" size={16} />
            {getShortName(payload.to, 12)}
          </span>
        </div>

        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>Value:</span>
          <span className={styles.payloadValue}>{formatUnits(BigInt(payload.value), decimals)}</span>
        </div>
      </>
    );
  };

  const renderApprovePayload = (payload: ApprovePayload) => {
    return (
      <>
        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>Owner:</span>

          <span className={styles.payloadValue}>
            <Identicon value={payload.owner} theme="polkadot" size={16} />
            {getShortName(payload.owner, 12)}
          </span>
        </div>

        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>Spender:</span>

          <span className={styles.payloadValue}>
            <Identicon value={payload.spender} theme="polkadot" size={16} />
            {getShortName(payload.spender, 12)}
          </span>
        </div>

        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>Value:</span>
          <span className={styles.payloadValue}>{formatUnits(BigInt(payload.value), decimals)}</span>
        </div>
      </>
    );
  };

  const renderMintPayload = (payload: MintPayload) => {
    return (
      <>
        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>To:</span>

          <span className={styles.payloadValue}>
            <Identicon value={payload.to} theme="polkadot" size={16} />
            {getShortName(payload.to, 12)}
          </span>
        </div>

        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>Value:</span>
          <span className={styles.payloadValue}>{formatUnits(BigInt(payload.value), decimals)}</span>
        </div>
      </>
    );
  };

  const renderBurnPayload = (payload: BurnPayload) => {
    return (
      <>
        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>From:</span>

          <span className={styles.payloadValue}>
            <Identicon value={payload.from} theme="polkadot" size={16} />
            {getShortName(payload.from, 12)}
          </span>
        </div>

        <div className={styles.payloadRow}>
          <span className={styles.payloadLabel}>Value:</span>
          <span className={styles.payloadValue}>{formatUnits(BigInt(payload.value), decimals)}</span>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <EventList<TransferPayload>
        title="Transfers"
        events={transfers.data?.result}
        eventName="Transfer"
        sails={sails}
        renderPayload={renderTransferPayload}
      />

      <EventList<ApprovePayload>
        title="Approvals"
        events={approvals.data?.result}
        eventName="Approval"
        sails={sails}
        renderPayload={renderApprovePayload}
      />

      <EventList<MintPayload>
        title="Mints"
        events={mints.data?.result}
        eventName="Minted"
        sails={sails}
        renderPayload={renderMintPayload}
      />

      <EventList<BurnPayload>
        title="Burns"
        events={burns.data?.result}
        eventName="Burned"
        sails={sails}
        renderPayload={renderBurnPayload}
      />
    </div>
  );
}

export { VftEvents };
