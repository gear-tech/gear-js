import { GearCommonStoragePrimitivesInterval, GearCoreMessageUserUserStoredMessage } from '../../lookup';
import { ITuple } from '@polkadot/types-codec/types';
import { Option } from '@polkadot/types';

export type MailboxItem = Option<ITuple<[GearCoreMessageUserUserStoredMessage, GearCommonStoragePrimitivesInterval]>>;

export type WaitlistItem = ITuple<[GearCoreMessageUserUserStoredMessage, GearCommonStoragePrimitivesInterval]>;
