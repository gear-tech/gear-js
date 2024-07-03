import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

type Payload = {
  value: string;
  gasLimit: string;
  initPayload: string;
  keepAlive: boolean;
  metaHex?: HexString;
  metadata?: ProgramMetadata | undefined;
  programName: string;
  payloadType?: string;
  idl?: string;
};

export type { Payload };
