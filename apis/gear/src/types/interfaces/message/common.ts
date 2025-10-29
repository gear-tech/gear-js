import { GearCommonStoragePrimitivesInterval, GearCoreMessageUserUserStoredMessage } from '../../lookup';
import { ITuple } from '@polkadot/types-codec/types';

export type MailboxItem = ITuple<[GearCoreMessageUserUserStoredMessage, GearCommonStoragePrimitivesInterval]>;

export type WaitlistItem = ITuple<[GearCoreMessageUserUserStoredMessage, GearCommonStoragePrimitivesInterval]>;
