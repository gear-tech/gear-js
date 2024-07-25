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
  sails: Sails,
): AnyJson => {
  const payload = getPayload(message);
  const serviceName = getServiceNamePrefix(payload);
  const functionName = getFnNamePrefix(payload);

  const constructor = sails.ctors[serviceName];
  const func = sails.services[serviceName]?.functions[functionName];

  if (constructor && !func) return constructor.decodePayload(payload);

  const method = isMessageQueued ? 'decodePayload' : 'decodeResult';
  return func[method](payload);
};

const getDecodedMessagePayload = (
  message: MessageToProgram | MessageFromProgram,
  isMessageQueued: boolean,
  metadata: ProgramMetadata | undefined,
  sails: Sails | undefined,
  onError: (value: string) => void,
) => {
  const payload = getPayload(message);

  try {
    if (isMessageWithError(message)) return CreateType.create('String', payload).toHuman();
    if (metadata) return { value: getMetadataDecodedMessagePayload(message, isMessageQueued, metadata) };
    if (sails) return getSailsDecodedMessagePayload(message, isMessageQueued, sails);

    return CreateType.create('Bytes', payload).toHuman();
  } catch (error) {
    onError(error instanceof Error ? error.message : String(error));

    return payload;
  }
};

export { isMessageWithError, getDecodedMessagePayload };
