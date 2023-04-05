import { DispatchStatus, GearApi, MessagesDispatched, UserMessageSent } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

export async function isMsgDispatchedSuccessfully(
  api: GearApi,
  messageId: HexString,
  fromBlock: HexString,
  numberOfBlocksToCheck = 100,
) {
  const bn = (await api.blocks.getBlockNumber(fromBlock)).toNumber();
  for (let i = bn; i < bn + numberOfBlocksToCheck; i++) {
    const { events } = await api.derive.chain.getBlockByNumber(i);
    const messagesDispatched = events.find((event) => event.event.method === 'MessagesDispatched');

    if (!messagesDispatched) continue;

    const event = messagesDispatched.event as MessagesDispatched;

    const status: DispatchStatus | undefined = await new Promise((resolve) => {
      event.data.statuses.forEach((status, id) => {
        if (id.eq(messageId)) {
          resolve(status);
        }
      });
      resolve(undefined);
    });

    if (!status) continue;

    return status.isSuccess;
  }
  return false;
}

export async function getReply(
  api: GearApi,
  programId: HexString,
  messageId: HexString,
  fromBlock: HexString,
  numberOfBlocksToCheck = 100,
) {
  const bn = (await api.blocks.getBlockNumber(fromBlock)).toNumber();
  for (let i = bn; i < bn + numberOfBlocksToCheck; i++) {
    const { events } = await api.derive.chain.getBlockByNumber(i);
    const userMessageSents = events.filter((event) => event.event.method === 'UserMessageSent');

    if (userMessageSents.length === 0) continue;

    for (const userMessageSent of userMessageSents) {
      const {
        data: {
          message: { id, source, payload, details },
        },
      } = userMessageSent.event as UserMessageSent;
      const reply = await new Promise((resolve) => {
        if (source.eq(programId) && details.isSome) {
          const unwrappedDetails = details.unwrap();
          if (unwrappedDetails.isReply && unwrappedDetails.asReply.replyTo.eq(messageId)) {
            resolve([id.toHex(), payload]);
          }
        }
        resolve(undefined);
      });

      if (!reply) continue;

      return {
        msgId: reply[0],
        payload: reply[1],
      };
    }
  }
}
