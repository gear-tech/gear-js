import { GearApi, MessageQueued, ProgramChanged, UserMessageSent } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { UnsubscribePromise } from '@polkadot/api/types';

export function waitForInit(api: GearApi, programId: string): Promise<UnsubscribePromise> {
  let messageId: HexString;
  return new Promise((resolve, reject) => {
    const unsub = api.query.system.events((events) => {
      events.forEach(({ event }) => {
        switch (event.method) {
          case 'MessageEnqueued':
            const meEvent = event as MessageQueued;
            if (meEvent.data.destination.eq(programId) && meEvent.data.entry.isInit) {
              messageId = meEvent.data.id.toHex();
            }
            break;
          case 'UserMessageSent':
            const {
              data: {
                message: { source, details, payload },
              },
            } = event as UserMessageSent;
            if (
              source.eq(programId) &&
              details.isSome &&
              details.unwrap().isReply &&
              details.unwrap().asReply.replyTo.eq(messageId) &&
              details.unwrap().asReply.statusCode.eq(1)
            ) {
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
