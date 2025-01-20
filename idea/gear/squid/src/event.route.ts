import { Store } from '@subsquid/typeorm-store';
import { Block } from '@subsquid/substrate-processor';
import { ZERO_ADDRESS } from 'sails-js';
import {
  Code,
  MessageEntryPoint,
  MessageFromProgram,
  MessageToProgram,
  MetaType,
  Program,
  CodeStatus,
  MessageReadReason,
  ProgramStatus,
  Voucher,
} from './model';

import { Event, Fields, ProcessorContext } from './processor';
import { TempState } from './temp-state';
import {
  isCreateProgram,
  isUploadCode,
  isUploadProgram,
  isSendMessageCall,
  isSendReplyCall,
  isVoucherCall,
} from './types/calls';
import {} from './model';
import { getMetahash } from './util';
import {
  handleCreateProgram,
  handleSendMessageCall,
  handleSendReplyCall,
  handleUploadProgram,
  handleVoucherCall,
} from './call.route';
import {
  ECodeChanged,
  EProgramChanged,
  EMessageQueuedEvent,
  EMessagesDispatched,
  EUserMessageRead,
  EUserMessageSent,
} from './types';
import {
  EBalanceTransfer,
  EVoucherDeclined,
  EVoucherIssued,
  EVoucherRevoked,
  EVoucherUpdated,
} from './types/events/voucher';

export interface IHandleEventProps<E = Event> {
  ctx: ProcessorContext<Store>;
  event: E;
  common: {
    timestamp: Date;
    blockHash: string;
    blockNumber: string;
  };
  tempState: TempState;
  block: Block<Fields>;
}

const callHandlers = [
  { pattern: isUploadProgram, handler: handleUploadProgram },
  { pattern: isSendMessageCall, handler: handleSendMessageCall },
  { pattern: isVoucherCall, handler: handleVoucherCall },
  { pattern: isCreateProgram, handler: handleCreateProgram },
  { pattern: isSendReplyCall, handler: handleSendReplyCall },
];

export async function handleMessageQueued({
  ctx,
  block,
  event,
  common,
  tempState,
}: IHandleEventProps<EMessageQueuedEvent>) {
  const call = event.call!;

  const msg = new MessageToProgram({
    ...common,
    id: event.args.id,
    source: event.args.source,
    destination: event.args.destination,
    entry: event.args.entry.__kind.toLowerCase() as MessageEntryPoint,
  });

  const { handler } = callHandlers.find(({ pattern }) => pattern(call)) || {};

  if (!handler) {
    console.log(call);
    throw new Error('Unknown call with message');
  }

  handler({ block, call, common, ctx, event, msg, tempState });

  tempState.addMsgToProgram(msg);
}

export async function handleUserMessageSent({ event, common, tempState }: IHandleEventProps<EUserMessageSent>) {
  const msg = new MessageFromProgram({
    ...common,
    id: event.args.message.id,
    source: event.args.message.source,
    destination: event.args.message.destination,
    payload: event.args.message.payload,
    value: event.args.message.value,
    replyToMessageId: event.args.message.details?.to || null,
    expiration: event.args.expirtaion || null,
    exitCode: !event.args.message.details?.code ? null : event.args.message.details.code.__kind === 'Success' ? 0 : 1,
  });

  msg.parentId = msg.replyToMessageId ? msg.replyToMessageId : await tempState.getMessageId(msg.id);

  if (event.args.message.destination === ZERO_ADDRESS) {
    tempState.addEvent(msg);
  } else {
    tempState.addMsgFromProgram(msg);
  }
}

const statuses = {
  Active: ProgramStatus.Active,
  Inactive: ProgramStatus.Exited,
  Terminated: ProgramStatus.Terminated,
  ProgramSet: ProgramStatus.ProgramSet,
};
const PROGRAM_STATUSES = Object.keys(statuses);

export async function handleProgramChanged({
  ctx,
  event,
  common,
  tempState,
  block,
}: IHandleEventProps<EProgramChanged>) {
  const {
    args: {
      change: { __kind: statusKind },
      id,
    },
    call,
  } = event;
  if (PROGRAM_STATUSES.includes(statusKind)) {
    if (statusKind === 'ProgramSet') {
      if (call?.name.toLowerCase() === 'gear.run' && !(await tempState.isProgramIndexed(id))) {
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
      const status = statuses[statusKind];

      await tempState.setProgramStatus(id, status);
    }
  } else {
    ctx.log.error(event.args, 'Unknown program status');
  }
}

export async function handleCodeChanged({ event, common, tempState }: IHandleEventProps<ECodeChanged>) {
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

export async function handleMessagesDispatched({ event, tempState }: IHandleEventProps<EMessagesDispatched>) {
  await Promise.all(
    event.args.statuses.map((s) => {
      tempState.removeParentMsgId(s[0]);
      return tempState.setDispatchedStatus(s[0], s[1].__kind);
    }),
  );
}

const reasons = {
  OutOfRent: MessageReadReason.OutOfRent,
  MessageClaimed: MessageReadReason.Claimed,
  MessageReplied: MessageReadReason.Replied,
};

export async function handleUserMessageRead({ ctx, event, tempState }: IHandleEventProps<EUserMessageRead>) {
  const reason: MessageReadReason = reasons[event.args.reason.value.__kind];

  if (!reason) {
    ctx.log.error(event.args, 'Unknown message read reason');
  }

  await tempState.setReadStatus(event.args.id, reason);
}

const VOUCHERS_FROM_SPEC_VERSION = 1100;

export function handleVoucherIssued({ event, block, tempState, common }: IHandleEventProps<EVoucherIssued>) {
  if (block.header.specVersion < VOUCHERS_FROM_SPEC_VERSION) return;

  const call = event.call!;

  const balance = BigInt(call.args.balance);
  const atBlock = BigInt(common.blockNumber);
  const atTime = common.timestamp;

  const voucher = new Voucher({
    id: event.args.voucherId,
    owner: event.args.owner,
    spender: event.args.spender,
    amount: balance,
    balance: BigInt(0), // it will be set by transfer event
    programs: call.args.programs,
    codeUploading: call.args.codeUploading,
    expiryAtBlock: atBlock + BigInt(call.args.duration),
    expiryAt: new Date(atTime.getTime() + call.args.duration * 3000),
    issuedAtBlock: atBlock,
    issuedAt: atTime,
    updatedAtBlock: atBlock,
    updatedAt: atTime,
  });

  tempState.addVoucher(voucher);
}

export async function handleVoucherUpdated({
  ctx,
  event,
  block,
  tempState,
  common,
}: IHandleEventProps<EVoucherUpdated>) {
  if (block.header.specVersion < VOUCHERS_FROM_SPEC_VERSION) return;

  const call = event.call!;

  const atBlock = BigInt(common.blockNumber);
  const atTime = common.timestamp;

  const voucher = await tempState.getVoucher(event.args.voucherId);

  if (!voucher) {
    ctx.log.error(`handleIsVoucherUpdated :: Voucher ${event.args.voucherId} not found`);
    return;
  }

  voucher.updatedAtBlock = atBlock;
  voucher.updatedAt = atTime;

  if (call.args.moveOwnership) {
    voucher.owner = call.args.moveOwnership;
  }

  if (call.args.balanceTopUp) {
    voucher.amount = BigInt(voucher.amount) + BigInt(call.args.balanceTopUp);
  }

  if (call.args.appendPrograms.__kind === 'Some') {
    voucher.programs!.push(...call.args.appendPrograms.value);
  }

  if (call.args.codeUploading) {
    voucher.codeUploading = call.args.codeUploading;
  }

  if (call.args.prolongDuration) {
    voucher.expiryAtBlock = atBlock + BigInt(call.args.prolongDuration);
    voucher.expiryAt = new Date(atTime.getTime() + call.args.prolongDuration * 3000);
  }
}

export async function handleVoucherDeclined({ event, block, tempState }: IHandleEventProps<EVoucherDeclined>) {
  if (block.header.specVersion < VOUCHERS_FROM_SPEC_VERSION) return;

  tempState.setVoucherDeclined(event.args.voucherId);
}

export function handleVoucherRevoked({ event, block, tempState }: IHandleEventProps<EVoucherRevoked>) {
  if (block.header.specVersion < VOUCHERS_FROM_SPEC_VERSION) return;

  tempState.setVoucherRevoked(event.args.voucherId);
}

export function handleBalanceTransfer({ event, block, tempState }: IHandleEventProps<EBalanceTransfer>) {
  if (block.header.specVersion < VOUCHERS_FROM_SPEC_VERSION) return;

  const fromBalance = tempState.getTransfer(event.args.from);
  const toBalance = tempState.getTransfer(event.args.to);

  tempState.setTransfer(event.args.from, fromBalance - BigInt(event.args.amount));
  tempState.setTransfer(event.args.to, toBalance + BigInt(event.args.amount));
}
