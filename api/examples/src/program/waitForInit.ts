import { GearApi, Hex, MessageEnqueued, ProgramChanged, UserMessageSent } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';

export function waitForInit(api: GearApi, programId: string): Promise<UnsubscribePromise> {
  let messageId: Hex;
  return new Promise((resolve, reject) => {
    const unsub = api.query.system.events((events) => {
      events.forEach(({ event }) => {
        switch (event.method) {
          case 'MessageEnqueued':
            const meEvent = event as MessageEnqueued;
            if (meEvent.data.destination.eq(programId) && meEvent.data.entry.isInit) {
              messageId = meEvent.data.id.toHex();
            }
            break;
          case 'UserMessageSent':
            const {
              data: {
                message: { source, reply, payload },
              },
            } = event as UserMessageSent;
            if (source.eq(programId) && reply.isSome && reply.unwrap()[0].eq(messageId) && reply.unwrap()[1].eq(1)) {
              reject(payload.toHuman());
            }
            break;
          case 'ProgramChanged':
            const pcEvent = event as ProgramChanged;
            if (pcEvent.data.id.eq(programId) && pcEvent.data.change.isActive) {
              resolve(unsub);
            }
            break;
        }
      });
    });
  });
}
