import type { ITuple } from '@polkadot/types-codec/types';
import type { GearCommonStoragePrimitivesInterval, GearCoreMessageUserUserStoredMessage } from '../../lookup';

export type MailboxItem = ITuple<[GearCoreMessageUserUserStoredMessage, GearCommonStoragePrimitivesInterval]>;

export type WaitlistItem = ITuple<[GearCoreMessageUserUserStoredMessage, GearCommonStoragePrimitivesInterval]>;
