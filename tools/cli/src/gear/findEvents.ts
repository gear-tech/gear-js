import { DispatchStatus, GearApi, MessagesDispatched, UserMessageSent } from '@gear-js/api';

export async function isMsgDispatchedSuccessfully(
  api: GearApi,
  messageId: `0x${string}`,
  fromBlock: `0x${string}`,
  numberOfBlocksToCheck: number = 100,
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
  programId: `0x${string}`,
  messageId: `0x${string}`,
  fromBlock: `0x${string}`,
  numberOfBlocksToCheck: number = 100,
) {
  const bn = (await api.blocks.getBlockNumber(fromBlock)).toNumber();
  for (let i = bn; i < bn + numberOfBlocksToCheck; i++) {
    const { events } = await api.derive.chain.getBlockByNumber(i);
    const userMessageSents = events.filter((event) => event.event.method === 'UserMessageSent');

    if (userMessageSents.length === 0) continue;

    for (const userMessageSent of userMessageSents) {
      const event = userMessageSent.event as UserMessageSent;
      const reply = await new Promise((resolve) => {
        if (event.data.message.source.eq(programId)) {
          if (event.data.message.details.isSome) {
            if (event.data.message.details.unwrap().isReply) {
              if (event.data.message.details.unwrap().asReply.replyTo.eq(messageId)) {
                resolve([event.data.message.id.toHex(), event.data.message.payload]);
              }
            }
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
