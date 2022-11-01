import { Hex } from '@gear-js/api';

type Message = {
  id: Hex;
  source: Hex;
  destination: Hex;
  value: string;
  payload: string;
  reply: null | {
    replyTo: Hex;
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
