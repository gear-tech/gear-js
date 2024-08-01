import { TypeormDatabase, Store } from '@subsquid/typeorm-store';
import { generateCodeHash } from '@gear-js/api';
import { ZERO_ADDRESS } from 'sails-js';
import { Code, Event as EventModel, MessageEntryPoint, MessageFromProgram, MessageToProgram, Program } from './model';

import { processor, ProcessorContext } from './processor';
import { TempState } from './temp-state';
import {
  isCodeChanged,
  isMessageQueued,
  isMessagesDispatched,
  isProgramChanged,
  isUserMessageRead,
  isUserMessageSent,
} from './types';
import { isCreateProgram, isUploadCode, isUploadProgram } from './types/calls';
import { isSendMessageCall, isSendReplyCall } from './types/calls/message';
import { isVoucherCall } from './types/calls/voucher';
import { CodeStatus, MessageReadReason, ProgramStatus } from './model';
import { getMetahash } from './util';

let tempState: TempState;

const PROGRAM_STATUSES = ['ProgramSet', 'Active', 'Terminated', 'Inactive'];

const handler = async (ctx: ProcessorContext<Store>) => {
  tempState.newState(ctx);

  for (const block of ctx.blocks) {
    const common = {
      timestamp: new Date((block.header as any).timestamp),
      blockHash: block.header.hash,
      blockNumber: block.header.height.toString(),
    };

    for (const event of block.events) {
      if (isMessageQueued(event)) {
        const call = event.call;

        const msg = new MessageToProgram({
          ...common,
          id: event.args.id,
          source: event.args.source,
          destination: event.args.destination,
          entry: event.args.entry.__kind.toLowerCase() as MessageEntryPoint,
        });

        if (isUploadProgram(call)) {
          const codeId = generateCodeHash(call.args.code);
          tempState.addProgram(
            new Program({
              ...common,
              id: event.args.destination,
              codeId,
              owner: event.args.source,
              name: event.args.destination,
            }),
          );
          msg.payload = call.args.initPayload;
          msg.value = call.args.value;
        } else if (isSendMessageCall(call)) {
          msg.payload = call.args.payload;
          msg.value = call.args.value;
        } else if (isVoucherCall(call)) {
          if (call.args.call.__kind === 'SendMessage') {
            msg.payload = call.args.call.payload;
            msg.value = call.args.call.value;
          } else if (call.args.call.__kind === 'SendReply') {
            msg.payload = call.args.call.payload;
            msg.replyToMessageId = call.args.call.replyToId;
            msg.value = call.args.call.value;
          } else {
            ctx.log.error(call, 'Unkown voucher call');
          }
        } else if (isCreateProgram(call)) {
          tempState.addProgram(
            new Program({
              ...common,
              id: event.args.destination,
              codeId: call.args.codeId,
              owner: event.args.source,
              name: event.args.destination,
            }),
          );
        } else if (isSendReplyCall(call)) {
          msg.payload = call.args.payload;
          msg.value = call.args.value;
          msg.replyToMessageId = call.args.replyToId;
        } else {
          console.log(call);
          throw new Error('Unkown call with message');
        }

        tempState.addMsgToProgram(msg);
      } else if (isUserMessageSent(event)) {
        const msg = new MessageFromProgram({
          ...common,
          id: event.args.message.id,
          source: event.args.message.source,
          destination: event.args.message.destination,
          payload: event.args.message.payload,
          value: event.args.message.value,
          replyToMessageId: event.args.message.details?.to || null,
          expiration: event.args.expirtaion || null,
          exitCode: event.args.message.details?.code?.__kind === 'Success' ? 0 : 1,
        });
        if (event.args.message.destination === ZERO_ADDRESS) {
          tempState.addEvent(msg);
        } else {
          tempState.addMsgFromProgram(msg);
        }
      } else if (isProgramChanged(event)) {
        if (PROGRAM_STATUSES.includes(event.args.change.__kind)) {
          const status = event.args.change.__kind;
          await tempState.setProgramStatus(
            event.args.id,
            status === 'ProgramSet'
              ? ProgramStatus.ProgramSet
              : status === 'Active'
                ? ProgramStatus.Active
                : status === 'Inactive'
                  ? ProgramStatus.Exited
                  : ProgramStatus.Terminated,
          );
        } else {
          ctx.log.error(event.args, 'Unknown program status');
        }
      } else if (isCodeChanged(event)) {
        if (isUploadCode(event.call) || isUploadProgram(event.call) || isVoucherCall(event.call)) {
          tempState.addCode(
            new Code({
              ...common,
              id: event.args.id,
              uploadedBy: (event.extrinsic as any)?.signature?.address?.value,
              metahash: await getMetahash(event.call),
            }),
          );
        }
        const status = event.args.change.__kind;
        await tempState.setCodeStatus(event.args.id, status === 'Active' ? CodeStatus.Active : CodeStatus.Inactive);
      } else if (isMessagesDispatched(event)) {
        await Promise.all(event.args.statuses.map((s) => tempState.setDispatchedStatus(s[0], s[1].__kind)));
      } else if (isUserMessageRead(event)) {
        let reason: MessageReadReason;

        if (event.args.reason.value.__kind === 'OutOfRent') {
          reason = MessageReadReason.OutOfRent;
        } else if (event.args.reason.value.__kind === 'MessageClaimed') {
          reason = MessageReadReason.Claimed;
        } else if (event.args.reason.value.__kind === 'MessageReplied') {
          reason = MessageReadReason.Replied;
        } else {
          ctx.log.error(event.args, 'Unknown message read reason');
        }
        await tempState.setReadStatus(event.args.id, reason);
      }
    }
  }

  await tempState.save();
};

const main = async () => {
  tempState = new TempState();
  processor.run(new TypeormDatabase({ supportHotBlocks: true }), handler);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
