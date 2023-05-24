import { plainToInstance } from 'class-transformer';
import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';
import { In } from 'typeorm';

import { processor } from './init-processor';
import { initDB } from './init-db';
import { MessageType, EventType } from '../common/enum';
import { Message } from '../model';

const messageMap = new Map<string, Message>();

async function eventHandler(ctx: BatchContext<Store, BatchProcessorItem<typeof processor>>): Promise<void> {
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      // eslint-disable-next-line no-continue
      if (item.kind !== 'event') continue;

      const { name } = item.event;
      const { header: { timestamp, hash } } = block;
      const time = new Date(timestamp);

      if (name === EventType.GEAR_USER_MSG_READ) {
        const { id, reason } = item.event.args;
        let updateMsg: Message | undefined;
        updateMsg = await ctx.store.findOneBy(Message, { id });

        if (!updateMsg) {
          updateMsg = messageMap.get(id);
        }


        if(updateMsg) {
          // eslint-disable-next-line no-underscore-dangle
          updateMsg.readReason = reason.value.__kind;
          updateMsg.isInMailBox = false;

          messageMap.set(updateMsg.id, updateMsg as Message);
        }
      }

      if (name === EventType.GEAR_MSG_DISPATCHED) {
        const { statuses } = item.event.args;
        let updateMessages: Message[] = [];
        const msgIds: string[] = [];
        let msgIdsNotInDB: string[] = [];
        const msgStatuses = new Map<string, string>();

        statuses.forEach((msg: string) => {
          const msgId = msg[0];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { __kind } = msg[1];

          msgIds.push(msgId);
          msgStatuses.set(msgId, __kind);
        });

        updateMessages = await ctx.store.find(Message, { where: { id: In(msgIds) } });
        msgIdsNotInDB = msgIds.filter(id => updateMessages.every(msg => msg.id !== id));

        msgIdsNotInDB.forEach(id => {
          const msg = messageMap.get(id);
          if(msg) updateMessages.push(msg);
        });

        if(updateMessages.length >= 1) {
          updateMessages.forEach(msg => {
            const status = msgStatuses.get(msg.id);
            msg.processedWithPanic = status !== 'Success';
            messageMap.set(msg.id, msg as Message);
          });

          msgStatuses.clear();
        }
      }

      if (name === EventType.GEAR_USER_MSG_SENT) {
        const { expiration, message } = item.event.args;
        const { id, destination, details, payload, source, value } = message;
        const isInMailBox = !!expiration;
        const createMessage = plainToInstance(Message, {
          id,
          destination,
          source,
          value: value || '0',
          payload,
          isInMailBox,
          replyToMessageId: details.value.replyTo,
          exitCode: details.value.statusCode,
          type: MessageType.USER_MSG_SENT,
          blockHash: hash,
          timestamp: time,
          expiration,
        });

        messageMap.set(id, createMessage);
      }

      if (name === EventType.GEAR_MSG_QUEUED) {
        const { destination, id, source, entry } = item.event.args;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { initPayload, payload, value, gasLimit } = item.event.extrinsic.call.args;
        // eslint-disable-next-line no-underscore-dangle
        const entryStatus = entry.__kind;
        const message = plainToInstance(Message, {
          id,
          destination,
          source,
          entry: entryStatus || null,
          blockHash: hash,
          timestamp: time,
          value: value || '0',
          gasLimit,
          payload: initPayload || payload,
          type: MessageType.QUEUED,
        });

        messageMap.set(id, message);
      }
    }
  }

  const messages = Array.from(messageMap.values());
  if (messages.length >= 1) {
    await ctx.store.save(messages);
    messageMap.clear();
  }
}

export function run() {
  processor.run(initDB, async (ctx) => {
    try {
      await eventHandler(ctx);
    } catch (error) {
      console.log('🔴 Indexer error', error);
    }
  });
}
