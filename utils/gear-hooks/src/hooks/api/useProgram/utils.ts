import { GearApi, Hex, MessageEnqueued, MessagesDispatched, ProgramChanged } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';
import { Event } from '@polkadot/types/interfaces';
import { Method, ProgramStatus } from './types';

const getExtrinsicFailedMessage = (api: GearApi, event: Event) => {
  const { docs, method: errorMethod } = api.getExtrinsicFailedError(event);
  const formattedDocs = docs.filter(Boolean).join('. ');

  return `${errorMethod}: ${formattedDocs}`;
};

const waitForProgramInit = (api: GearApi, programId: string) => {
  let messageId: Hex;
  let unsubPromise: UnsubscribePromise;

  const unsubscribe = async () => (await unsubPromise)();

  return new Promise<string>((resolve) => {
    unsubPromise = api.query.system.events((events) => {
      events.forEach(({ event }) => {
        switch (event.method) {
          case Method.MessageEnqueued: {
            const meEvent = event as MessageEnqueued;

            if (meEvent.data.destination.eq(programId) && meEvent.data.entry.isInit) {
              messageId = meEvent.data.id.toHex();
            }

            break;
          }

          case Method.MessagesDispatched: {
            const mdEvent = event as MessagesDispatched;

            mdEvent.data.statuses.forEach(
              ({ isFailed }, id) => id.eq(messageId) && isFailed && resolve(ProgramStatus.Failed),
            );

            break;
          }

          case Method.ProgramChanged: {
            const pcEvent = event as ProgramChanged;

            if (pcEvent.data.id.eq(programId) && pcEvent.data.change.isActive) resolve(ProgramStatus.Success);

            break;
          }
          default:
            break;
        }
      });
    });
  }).finally(unsubscribe);
};

export { getExtrinsicFailedMessage, waitForProgramInit };
