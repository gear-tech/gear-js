import { Store } from '@subsquid/typeorm-store';
import { Block } from '@subsquid/substrate-processor';
import { ZERO_ADDRESS } from 'sails-js';
import { Code, MessageEntryPoint, MessageFromProgram, MessageToProgram, MetaType, Program } from './model';

import { Event, Fields, ProcessorContext } from './processor';
import { TempState } from './temp-state';
import { isCreateProgram, isUploadCode, isUploadProgram } from './types/calls';
import { isSendMessageCall, isSendReplyCall } from './types/calls/message';
import { isVoucherCall } from './types/calls/voucher';
import { CodeStatus, MessageReadReason, ProgramStatus } from './model';
import { getMetahash } from './util';
import {
  IHandleCallProps,
  handleCreateProgram,
  handleSendMessageCall,
  handleSendReplyCall,
  handleUploadProgram,
  handleVoucherCall,
} from './call.route';

export interface IHandleEventProps {
  ctx: ProcessorContext<Store>;
  event: Event;
  common: {
    timestamp: Date;
    blockHash: string;
    blockNumber: string;
  };
  tempState: TempState;
  block: Block<Fields>;
}

const callHandlers: Array<{
  pattern: (obj: any) => boolean;
  handler: (args: IHandleCallProps) => Promise<void> | void;
}> = [
  { pattern: isUploadProgram, handler: handleUploadProgram },
  { pattern: isSendMessageCall, handler: handleSendMessageCall },
  { pattern: isVoucherCall, handler: handleVoucherCall },
  { pattern: isCreateProgram, handler: handleCreateProgram },
  { pattern: isSendReplyCall, handler: handleSendReplyCall },
];

export async function handleMessageQueued({ ctx, block, event, common, tempState }: IHandleEventProps) {
  const call = event.call;

  const msg = new MessageToProgram({
    ...common,
    id: event.args.id,
    source: event.args.source,
    destination: event.args.destination,
    entry: event.args.entry.__kind.toLowerCase() as MessageEntryPoint,
  });

  const { handler } = callHandlers.find(({ pattern }) => pattern(call));

  if (!handler) {
    console.log(call);
    throw new Error('Unknown call with message');
  }

  await handler({ block, call, common, ctx, event, msg, tempState });

  tempState.addMsgToProgram(msg);
}

export async function handleUserMessageSent({ event, common, tempState }: IHandleEventProps) {
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

  const parentId = await tempState.getMessageId(msg.id);
  if (parentId) {
    msg.parentId = parentId;
  }

  if (event.args.message.destination === ZERO_ADDRESS) {
    tempState.addEvent(msg);
  } else {
    tempState.addMsgFromProgram(msg);
  }
}

const PROGRAM_STATUSES = ['ProgramSet', 'Active', 'Terminated', 'Inactive'];

export async function handleProgramChanged({ ctx, event, common, tempState, block }: IHandleEventProps) {
  const {
    args: {
      change: { __kind: statusKind },
      id,
    },
    call,
  } = event;
  if (PROGRAM_STATUSES.includes(statusKind)) {
    if (statusKind === 'ProgramSet' && !call) {
      if (!(await tempState.isProgramIndexed(id))) {
        tempState.addProgram(
          new Program({
            ...common,
            id,
            codeId: await tempState.getCodeId(id, block.header),
            owner: null,
            name: id,
            status: ProgramStatus.ProgramSet,
          }),
        );
      }
    } else {
      const status =
        statusKind === 'ProgramSet'
          ? ProgramStatus.ProgramSet
          : statusKind === 'Active'
          ? ProgramStatus.Active
          : statusKind === 'Inactive'
          ? ProgramStatus.Exited
          : ProgramStatus.Terminated;

      await tempState.setProgramStatus(id, status);
    }
  } else {
    ctx.log.error(event.args, 'Unknown program status');
  }
}

export async function handleCodeChanged({ event, common, tempState }: IHandleEventProps) {
  if (isUploadCode(event.call) || isUploadProgram(event.call) || isVoucherCall(event.call)) {
    const metahash = await getMetahash(event.call);
    tempState.addCode(
      new Code({
        ...common,
        id: event.args.id,
        name: event.args.id,
        uploadedBy: (event.extrinsic as any)?.signature?.address?.value,
        metahash,
        metaType: metahash ? MetaType.Meta : null,
      }),
    );
  }
  const status = event.args.change.__kind;
  await tempState.setCodeStatus(event.args.id, status === 'Active' ? CodeStatus.Active : CodeStatus.Inactive);
}

export async function handleMessagesDispatched({ event, tempState }: IHandleEventProps) {
  await tempState.removeMessagesId(event.args.id);
  await Promise.all(event.args.statuses.map((s) => tempState.setDispatchedStatus(s[0], s[1].__kind)));
}

const reasons = {
  OutOfRent: MessageReadReason.OutOfRent,
  MessageClaimed: MessageReadReason.Claimed,
  MessageReplied: MessageReadReason.Replied,
};

export async function handleUserMessageRead({ ctx, event, tempState }: IHandleEventProps) {
  const reason: MessageReadReason = reasons[event.args.reason.value.__kind];

  if (!reason) {
    ctx.log.error(event.args, 'Unknown message read reason');
  }

  await tempState.setReadStatus(event.args.id, reason);
}
