import { GearApi, Hex } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';

export const waitForProgramInit = (api: GearApi, programId: string) => {
  let messageId: Hex;
  const unsubscribes: UnsubscribePromise[] = [];

  unsubscribes.push(
    api.gearEvents.subscribeToGearEvent('MessageEnqueued', (event) => {
      if (event.data.destination.eq(programId) && event.data.entry.isInit) {
        messageId = event.data.id.toHex();
      }
    })
  );

  const resultPromise = Promise.race([
    new Promise<string>((resolve) => {
      unsubscribes.push(
        api.gearEvents.subscribeToGearEvent('ProgramChanged', (event) => {
          if (event.data.id.eq(programId) && event.data.change.isActive) {
            resolve('success');
          }
        })
      );
    }),
    new Promise<string>((resolve) => {
      unsubscribes.push(
        api.gearEvents.subscribeToGearEvent('UserMessageSent', (event) => {
          if (
            event.data.source.eq(programId) &&
            event.data.reply.unwrap()[0].eq(messageId) &&
            !event.data.reply.unwrap()[1].eq(0)
          ) {
            resolve('failed');
          }
        })
      );
    }),
  ]);

  return async () => {
    const result = await resultPromise;

    for await (const unsubscribe of unsubscribes) {
      unsubscribe();
    }

    return result;
  };
};
