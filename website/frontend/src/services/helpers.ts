import { GearApi, Hex, MessageEnqueued, MessagesDispatched, ProgramChanged } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';

export const waitForProgramInit = (api: GearApi, programId: string) => {
  let unsub: UnsubscribePromise;
  let messageId: Hex;

  const initPromise = new Promise<string>((resolve, reject) => {
    unsub = api.query.system.events((events: any) => {
      events.forEach(({ event }: any) => {
        switch (event.method) {
          case 'MessageEnqueued': {
            const meEvent = event as MessageEnqueued;

            if (meEvent.data.destination.eq(programId) && meEvent.data.entry.isInit) {
              messageId = meEvent.data.id.toHex();
            }

            break;
          }
          case 'MessagesDispatched': {
            const mdEvent = event as MessagesDispatched;

            for (const [id, status] of mdEvent.data.statuses) {
              if (id.eq(messageId) && status.isFailed) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('failed');

                break;
              }
            }

            break;
          }
          case 'ProgramChanged': {
            const pcEvent = event as ProgramChanged;

            if (pcEvent.data.id.eq(programId) && pcEvent.data.change.isActive) {
              resolve('success');
            }

            break;
          }
          default:
            break;
        }
      });
    });
  });

  return async () => {
    const result = await initPromise;

    (await unsub)();

    return result;
  };
};
