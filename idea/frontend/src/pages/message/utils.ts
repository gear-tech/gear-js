import { CreateType, HexString, ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { Sails, getServiceNamePrefix, getFnNamePrefix } from 'sails-js';

import {
  MESSAGE_TYPE,
  Message,
  getDecodedMessagePayload as getMetadataDecodedMessagePayload,
} from '@/features/message';
import { MESSAGE_ENTRY_POINT } from '@/features/message/consts';

const isHexEmpty = (value: HexString) => /^0x0*$/.test(value);

const getSailsDecodedMessagePayload = (message: Message, sails: Sails): AnyJson => {
  const { destination, payload, type, entry } = message;
  const serviceName = getServiceNamePrefix(payload);

  if (entry === MESSAGE_ENTRY_POINT.INIT) return sails.ctors[serviceName].decodePayload(payload);

  const isReply = isHexEmpty(destination);
  const functionName = getFnNamePrefix(payload);

  if (isReply) return sails.services[serviceName].events[functionName].decode(payload) as AnyJson;

  const method = type === MESSAGE_TYPE.MESSAGE_QUEUED ? 'decodePayload' : 'decodeResult';
  return sails.services[serviceName].functions[functionName][method](payload);
};

const getDecodedMessagePayload = (
  message: Message,
  metadata: ProgramMetadata | undefined,
  sails: Sails | undefined,
  onError: (value: string) => void,
) => {
  const { payload, exitCode } = message;

  try {
    if (exitCode) return CreateType.create('String', payload).toHuman();
    if (metadata) return getMetadataDecodedMessagePayload(message, metadata);
    if (sails) return getSailsDecodedMessagePayload(message, sails);

    return CreateType.create('Bytes', payload).toHuman();
  } catch (error) {
    onError(error instanceof Error ? error.message : String(error));

    return payload;
  }
};

export { getDecodedMessagePayload };
