import { CreateType, type ProgramMetadata } from '@gear-js/api';
import type { AnyJson } from '@polkadot/types/types';
import { getFnNamePrefix, getServiceNamePrefix } from 'sails-js';

import type { ParsedSails } from '@/features/sails/types';

import { getReplyErrorReason, isNullOrUndefined } from '@/shared/helpers';

import type { MessageFromProgram, MessageToProgram } from './api';
import { MESSAGE_ENTRY_POINT } from './consts';

const isMessageFromProgramWithError = (message?: MessageToProgram | MessageFromProgram) =>
  message && 'exitCode' in message && Boolean(message.exitCode);

const isMessageWithError = (message: MessageToProgram | MessageFromProgram) =>
  isMessageFromProgramWithError(message) || ('processedWithPanic' in message && message.processedWithPanic);

const getPayload = ({ payload }: MessageToProgram | MessageFromProgram) => payload || '0x';

const getTypeIndex = (
  message: MessageToProgram | MessageFromProgram,
  isMessageQueued: boolean,
  meta: ProgramMetadata,
) => {
  const returnMethod = isMessageQueued ? 'input' : 'output';

  if ('entry' in message) {
    switch (message.entry) {
      case MESSAGE_ENTRY_POINT.INIT:
        return meta.types.init[returnMethod];

      case MESSAGE_ENTRY_POINT.REPLY:
        return meta.types.reply;

      case MESSAGE_ENTRY_POINT.HANDLE:
        return meta.types.handle[returnMethod];

      default:
        return meta.types.others[returnMethod];
    }
  }

  const payload = getPayload(message);

  const typeIndexes = [
    meta.types.handle[returnMethod],
    meta.types.init[returnMethod],
    meta.types.reply,
    meta.types.others[returnMethod],
  ];

  return typeIndexes.find((index) => {
    if (isNullOrUndefined(index)) return false;

    try {
      meta.createType(index, payload);
      return true;
    } catch {
      return false;
    }
  });
};

const getMetadataDecodedMessagePayload = (
  message: MessageToProgram | MessageFromProgram,
  isMessageQueued: boolean,
  meta: ProgramMetadata,
) => {
  const payload = getPayload(message);
  const typeIndex = getTypeIndex(message, isMessageQueued, meta);

  return isNullOrUndefined(typeIndex) ? payload : meta.createType(typeIndex, payload).toHuman();
};

const getSailsDecodedMessagePayload = (
  message: MessageToProgram | MessageFromProgram,
  isMessageQueued: boolean,
  program: ParsedSails,
): AnyJson => {
  const payload = getPayload(message);
  const serviceName = getServiceNamePrefix(payload);
  const functionName = getFnNamePrefix(payload);

  const constructor = program.ctors?.[serviceName];
  const func = program.services[serviceName]?.functions[functionName];

  if (constructor && !func) return constructor.decodePayload(payload);

  const method = isMessageQueued ? 'decodePayload' : 'decodeResult';
  return func[method](payload);
};

const getDecodedMessagePayload = (
  message: MessageToProgram | MessageFromProgram,
  isMessageQueued: boolean,
  metadata: ProgramMetadata | undefined,
  program: ParsedSails | undefined,
  onError: (value: string) => void,
  specVersion: number,
) => {
  const payload = getPayload(message);

  try {
    if (!isMessageQueued && isMessageWithError(message)) {
      const payloadString = CreateType.create('String', payload).toHuman() as string;
      const { replyCode } = message;
      return replyCode ? getReplyErrorReason(replyCode, specVersion, payloadString) : payloadString;
    }

    if (metadata) return { value: getMetadataDecodedMessagePayload(message, isMessageQueued, metadata) };
    if (program) return getSailsDecodedMessagePayload(message, isMessageQueued, program);

    return CreateType.create('Bytes', payload).toHuman();
  } catch (error) {
    onError(error instanceof Error ? error.message : String(error));

    return payload;
  }
};

export { getDecodedMessagePayload, isMessageFromProgramWithError, isMessageWithError };
