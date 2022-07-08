import { Hash, BlockNumber, H256 } from '@polkadot/types/interfaces';
import { Null, Enum, Option } from '@polkadot/types';
import { MessageId } from './message';

export type ProgramId = Hash;

export type CodeId = Hash;

export interface Entry extends Enum {
  isInit: boolean;
  isHandle: boolean;
  isReply: boolean;
  asInit: Null;
  asHandle: Null;
  asReply: MessageId;
}

export interface ProgramChangedKind extends Enum {
  isActive: boolean;
  isInactive: boolean;
  isPaused: boolean;
  asActive: { expiration: BlockNumber };
  asInactive: Null;
  asPaused: {
    code_hash: H256;
    memory_hash: H256;
    waitlist_hash: H256;
  };
}

export interface CodeChangeKind extends Enum {
  isActive: boolean;
  isInactive: boolean;
  isReinstrumented: boolean;
  asActive: { expiration: Option<BlockNumber> };
  asInactive: Null;
  asReinstrumented: Null;
}
