import { AnyJson } from '@polkadot/types/types';
import { CreateType, ProgramMetadata } from '@gear-js/api';
import { Sails, getServiceNamePrefix, getFnNamePrefix } from 'sails-js';

import { isNullOrUndefined } from '@/shared/helpers';

import { MessageToProgram, MessageFromProgram } from './api';
import { MESSAGE_ENTRY_POINT } from './consts';

const isMessageWithError = (message: MessageToProgram | MessageFromProgram) =>
  ('exitCode' in message && Boolean(message.exitCode)) ||
  ('processedWithPanic' in message && message.processedWithPanic);

const getPayload = ({ payload }: MessageToProgram | MessageFromProgram) => payload || '0x';

const getTypeIndex = (message: MessageToProgram | MessageFromProgram, meta: ProgramMetadata) => {
  if ('entry' in message) {
    switch (message.entry) {
      case MESSAGE_ENTRY_POINT.INIT:
        return meta.types.init.input;

      case MESSAGE_ENTRY_POINT.REPLY:
        return meta.types.reply;

      case MESSAGE_ENTRY_POINT.HANDLE:
        return meta.types.handle.input;

      default:
        return meta.types.others.input;
    }
  }

  const payload = getPayload(message);
  const typeIndexes = [meta.types.handle.output, meta.types.init.output, meta.types.reply, meta.types.others.output];

  return typeIndexes.find((index) => {
    if (isNullOrUndefined(index)) return false;

    try {
      meta.createType(index, payload);
      console.log(index);
      return true;
    } catch {
      return false;
    }
  });
};

const getMetadataDecodedMessagePayload = (message: MessageToProgram | MessageFromProgram, meta: ProgramMetadata) => {
  const payload = getPayload(message);
  const typeIndex = getTypeIndex(message, meta);

  return isNullOrUndefined(typeIndex) ? payload : meta.createType(typeIndex, payload);
};

const getSailsDecodedMessagePayload = (
  message: MessageToProgram | MessageFromProgram,
  isMessageQueued: boolean,
  sails: Sails,
): { value: AnyJson; serviceName?: string; functionName?: string } => {
  const payload = getPayload(message);
  const serviceName = getServiceNamePrefix(payload);
  const functionName = getFnNamePrefix(payload);

  const constructor = sails.ctors[serviceName];
  const func = sails.services[serviceName].functions[functionName];

  if (constructor && !func) return { value: constructor.decodePayload(payload), serviceName };

  const method = isMessageQueued ? 'decodePayload' : 'decodeResult';
  return { value: func[method](payload), serviceName, functionName };
};

const getDecodedMessagePayload = (
  message: MessageToProgram | MessageFromProgram,
  metadata: ProgramMetadata | undefined,
  sails: Sails | undefined,
  isMessageQueued: boolean,
  onError: (value: string) => void,
) => {
  const payload = getPayload(message);

  try {
    if (isMessageWithError(message)) return { value: CreateType.create('String', payload).toHuman() };
    if (metadata) return { value: getMetadataDecodedMessagePayload(message, metadata) };

    if (sails) return getSailsDecodedMessagePayload(message, isMessageQueued, sails);

    return { value: CreateType.create('Bytes', payload).toHuman() };
  } catch (error) {
    onError(error instanceof Error ? error.message : String(error));

    return { value: payload };
  }
};

export { isMessageWithError, getDecodedMessagePayload };
