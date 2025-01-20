import { HexString } from '@polkadot/util/types';

type UserStoredMessage = {
  id: HexString;
  source: HexString;
  destination: HexString;
  value: string;
  payload: string;
};

type Interval = {
  start: string;
  finish: string;
};

type MailboxItem = [UserStoredMessage, Interval];

export type { MailboxItem };
