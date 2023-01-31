import { HexString } from '@polkadot/util/types';

type MailMessage = {
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
  awaken: any[];
  initialized: any[];
  outgoing: {};
  reply: null;
  replySent: boolean;
};

type WaitlistContent = {
  context: Context;
  message: MailMessage;
  kind: string;
};

type HumanWaitlistItem = [WaitlistContent, Interval];

export type { WaitlistContent, Interval, HumanWaitlistItem };
