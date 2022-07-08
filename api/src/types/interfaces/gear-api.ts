import { Bytes } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { ApiOptions } from '@polkadot/api/types';

export interface GearApiOptions extends ApiOptions {
  providerAddress?: string;
}

export declare interface MessageInfo extends Bytes {
  messageId: H256;
  programId: H256;
  origin: H256;
}
