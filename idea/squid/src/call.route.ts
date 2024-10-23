import { generateCodeHash } from '@gear-js/api';
import { MessageToProgram, Program, ProgramStatus } from './model';

import { IHandleEventProps } from './event.route';
import { Call } from './processor';
import { EMessageQueuedEvent } from './types';
import { CCreateProgram, CSendMessage, CSendReply, CUploadProgram, CVoucherCall } from './types/calls';

export interface IHandleCallProps<C = Call> extends IHandleEventProps<EMessageQueuedEvent> {
  msg: MessageToProgram;
  call: C;
}

export function handleUploadProgram({ msg, event, common, tempState, call }: IHandleCallProps<CUploadProgram>) {
  const codeId = generateCodeHash(call.args.code);
  tempState.addProgram(
    new Program({
      ...common,
      id: event.args.destination,
      codeId,
      owner: event.args.source,
      name: event.args.destination,
      status: ProgramStatus.ProgramSet,
    }),
  );
  msg.payload = call.args.initPayload;
  msg.value = call.args.value;
}

export function handleSendMessageCall({ msg, call }: IHandleCallProps<CSendMessage>) {
  msg.payload = call.args.payload;
  msg.value = call.args.value;
}

export function handleVoucherCall({ ctx, msg, call }: IHandleCallProps<CVoucherCall>) {
  if (call.args.call.__kind === 'SendMessage') {
    msg.payload = call.args.call.payload;
    msg.value = call.args.call.value;
  } else if (call.args.call.__kind === 'SendReply') {
    msg.payload = call.args.call.payload;
    msg.replyToMessageId = call.args.call.replyToId;
    msg.value = call.args.call.value;
  } else {
    ctx.log.error(call, 'Unknown voucher call');
  }
}

export function handleCreateProgram({ msg, event, common, tempState, call }: IHandleCallProps<CCreateProgram>) {
  tempState.addProgram(
    new Program({
      ...common,
      id: event.args.destination,
      codeId: call.args.codeId,
      owner: event.args.source,
      name: event.args.destination,
      status: ProgramStatus.ProgramSet,
    }),
  );

  msg.payload = call.args.initPayload;
  msg.value = call.args.value;
}

export function handleSendReplyCall({ msg, call }: IHandleCallProps<CSendReply>) {
  msg.payload = call.args.payload;
  msg.value = call.args.value;
  msg.replyToMessageId = call.args.replyToId;
}
