import {
  GearApi,
  GearCommonEventDispatchStatus,
  MessagesDispatched,
  ProgramChanged,
  UserMessageSent,
} from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

export async function isProgramInitialized(
  api: GearApi,
  programId: HexString,
  fromBlock: HexString,
  numberOfBlocksToCheck = 100,
) {
  const bn = (await api.blocks.getBlockNumber(fromBlock)).toNumber();
  for (let i = bn; i < bn + numberOfBlocksToCheck; i++) {
    const { events } = await api.derive.chain.getBlockByNumber(i);

    const programChanged = events.filter(({ event: { method } }) => method === 'ProgramChanged');

    if (!programChanged) continue;

    for (const event of programChanged) {
      const { data } = event.event as ProgramChanged;

      if (!data.id.eq(programId)) continue;

      if (data.change.isActive) {
        return true;
      } else if (data.change.isTerminated) {
        return false;
      }
    }
  }
  return false;
}

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

    const status: GearCommonEventDispatchStatus | undefined = await new Promise((resolve) => {
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
          if (unwrappedDetails.to.eq(messageId)) {
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
