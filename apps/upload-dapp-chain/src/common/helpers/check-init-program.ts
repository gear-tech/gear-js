import { GearApi, Hex, MessagesDispatched, MessageEnqueued } from "@gear-js/api";
import { UnsubscribePromise } from "@polkadot/api/types";

export const checkInitProgram = (api: GearApi, programId: string) => {
  let messageId: Hex;
  let unsubPromise: UnsubscribePromise;

  const unsubscribe = async () => (await unsubPromise)();

  return new Promise((resolve, reject) => {
    unsubPromise = api.query.system.events((events) => {
      events.forEach(({ event }) => {
        switch (event.method) {
          case "MessageEnqueued":
            const meEvent = event as MessageEnqueued;
            if (meEvent.data.destination.eq(programId) && meEvent.data.entry.isInit) {
              messageId = meEvent.data.id.toHex();
            }
            break;
          case "MessagesDispatched":
            const mdEvent = event as MessagesDispatched;
            for (const [id, status] of mdEvent.data.statuses) {
              if (id.eq(messageId)) {
                if (status.isFailed) {
                  reject("failed");
                  break;
                }
                if (status.isSuccess) {
                  resolve("success");
                  break;
                }
              }
            }
            break;
        }
      });
    });
  }).finally(unsubscribe);
};
