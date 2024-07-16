import { CreateType, HexString, ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { Sails, getServiceNamePrefix, getFnNamePrefix, getCtorNamePrefix } from 'sails-js';

import {
  MESSAGE_TYPE,
  Message,
  getDecodedMessagePayload as getMetadataDecodedMessagePayload,
} from '@/features/message';
import { MESSAGE_ENTRY_POINT } from '@/features/message/consts';

const isHexEmpty = (value: HexString) => /^0x0*$/.test(value);

const getSailsDecodedMessagePayload = (
  message: Message,
  sails: Sails,
): { value: AnyJson; serviceName?: string; functionName?: string } => {
  const { destination, payload, type, entry } = message;

  if (entry === MESSAGE_ENTRY_POINT.INIT) {
    const serviceName = getCtorNamePrefix(payload);

    return { value: sails.ctors[serviceName].decodePayload(payload), serviceName };
  }

  const serviceName = getServiceNamePrefix(payload);
  const isReply = isHexEmpty(destination);
  const functionName = getFnNamePrefix(payload);

  if (isReply)
    return { value: sails.services[serviceName].events[functionName].decode(payload), serviceName, functionName };

  const method = type === MESSAGE_TYPE.MESSAGE_QUEUED ? 'decodePayload' : 'decodeResult';
  return { value: sails.services[serviceName].functions[functionName][method](payload), serviceName, functionName };
};

const getDecodedMessagePayload = (
  message: Message,
  metadata: ProgramMetadata | undefined,
  sails: Sails | undefined,
  onError: (value: string) => void,
) => {
  const { payload, exitCode } = message;

  try {
    if (exitCode) return { value: CreateType.create('String', payload).toHuman() };
    if (metadata) return { value: getMetadataDecodedMessagePayload(message, metadata) };
    if (sails) return getSailsDecodedMessagePayload(message, sails);

    return { value: CreateType.create('Bytes', payload).toHuman() };
  } catch (error) {
    onError(error instanceof Error ? error.message : String(error));

    return { payload };
  }
};

export { getDecodedMessagePayload };
