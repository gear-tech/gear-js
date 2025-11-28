import { HexString } from '@gear-js/api';
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

  const renderEvents = () =>
    events.map(({ payload, ...event }) => {
      const decodedPayload = getDecodedPayload(payload!);

      return (
        <li key={event.id}>
          <header>
            <h4>{eventName.charAt(0).toUpperCase() + eventName.slice(1)}</h4>

            <span>{new Date(event.timestamp).toLocaleString()}</span>
            <span>{event.blockNumber}</span>
          </header>

          <div>{renderPayload(decodedPayload)}</div>
        </li>
      );
    });

  return (
    <Box>
      <h3>{title}</h3>
      <ul>{renderEvents()}</ul>
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
        <div>
          <span>From:</span>
          <span>{getShortName(payload.from)}</span>
        </div>

        <div>
          <span>To:</span>
          <span>{getShortName(payload.to)}</span>
        </div>

        <div>
          <span>Value:</span>
          <span>{formatUnits(BigInt(payload.value), decimals)}</span>
        </div>
      </>
    );
  };

  const renderApprovePayload = (payload: ApprovePayload) => {
    return (
      <>
        <div>
          <span>Owner:</span>
          <span>{getShortName(payload.owner)}</span>
        </div>

        <div>
          <span>Spender:</span>
          <span>{getShortName(payload.spender)}</span>
        </div>

        <div>
          <span>Value:</span>
          <span>{formatUnits(BigInt(payload.value), decimals)}</span>
        </div>
      </>
    );
  };

  const renderMintPayload = (payload: MintPayload) => {
    return (
      <>
        <div>
          <span>To:</span>
          <span>{getShortName(payload.to)}</span>
        </div>

        <div>
          <span>Value:</span>
          <span>{formatUnits(BigInt(payload.value), decimals)}</span>
        </div>
      </>
    );
  };

  const renderBurnPayload = (payload: BurnPayload) => {
    return (
      <>
        <div>
          <span>From:</span>
          <span>{getShortName(payload.from)}</span>
        </div>

        <div>
          <span>Value:</span>
          <span>{formatUnits(BigInt(payload.value), decimals)}</span>
        </div>
      </>
    );
  };

  return (
    <div>
      <h2>VFT Events</h2>

      <div className={styles.eventsContainer}>
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
    </div>
  );
}

export { VftEvents };
