import { HexString } from '@polkadot/util/types';

type Message = {
  id: HexString;
  source: HexString;
  destination: HexString;
  value: string;
  payload: string;
  reply: null | {
    replyTo: HexString;
    exitCode: number;
  };
};

type Interval = {
  start: string;
  finish: string;
};

type Context = {
  awaken: unknown[];
  initialized: unknown[];
  outgoing: {};
  reply: null;
  replySent: boolean;
};

type WaitlistContent = {
  context: Context;
  message: Message;
  kind: string;
};

type FormattedMailboxItem = [Message, Interval];

type FormattedWaitlistItem = [WaitlistContent, Interval];

export type { FormattedMailboxItem, FormattedWaitlistItem };
