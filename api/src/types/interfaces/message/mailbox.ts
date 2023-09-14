import { GearCommonStoragePrimitivesInterval, GearCoreMessageUserUserStoredMessage } from '@polkadot/types/lookup';
import { ITuple } from '@polkadot/types-codec/types';
import { Option } from '@polkadot/types';

export type MailboxItem = Option<ITuple<[GearCoreMessageUserUserStoredMessage, GearCommonStoragePrimitivesInterval]>>;
