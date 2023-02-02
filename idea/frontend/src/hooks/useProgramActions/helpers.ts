import { UnsubscribePromise } from '@polkadot/api/types';
import { GearApi, MessageEnqueued, MessagesDispatched, ProgramChanged } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import { Method } from 'entities/explorer';
import { ProgramStatus } from 'entities/program';

const waitForProgramInit = (api: GearApi, programId: string) => {
  let messageId: HexString;
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

            // eslint-disable-next-line no-restricted-syntax
            for (const [id, status] of mdEvent.data.statuses) {
              if (id.eq(messageId) && status.isFailed) {
                resolve(ProgramStatus.Terminated);
              }
            }

            break;
          }
          case Method.ProgramChanged: {
            const pcEvent = event as ProgramChanged;

            if (pcEvent.data.id.eq(programId) && pcEvent.data.change.isActive) {
              resolve(ProgramStatus.Active);
            }

            break;
          }
          default:
            break;
        }
      });
    });
  }).finally(unsubscribe);
};

export { waitForProgramInit };
