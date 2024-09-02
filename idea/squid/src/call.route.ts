import { generateCodeHash } from '@gear-js/api';
import { MessageToProgram, Program } from './model';

import { IHandleEventProps } from './event.route';
import { Call } from './processor';

export interface IHandleCallProps extends IHandleEventProps {
  msg: MessageToProgram;
  call: Call;
}

export function handleUploadProgram({ msg, event, common, tempState, call }: IHandleCallProps) {
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
}

export function handleSendMessageCall({ msg, call }: IHandleCallProps) {
  msg.payload = call.args.payload;
  msg.value = call.args.value;
}

export function handleVoucherCall({ ctx, msg, call }: IHandleCallProps) {
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

export function handleCreateProgram({ event, common, tempState, call }: IHandleCallProps) {
  tempState.addProgram(
    new Program({
      ...common,
      id: event.args.destination,
      codeId: call.args.codeId,
      owner: event.args.source,
      name: event.args.destination,
    }),
  );
}

export function handleSendReplyCall({ msg, call }: IHandleCallProps) {
  msg.payload = call.args.payload;
  msg.value = call.args.value;
  msg.replyToMessageId = call.args.replyToId;
}
