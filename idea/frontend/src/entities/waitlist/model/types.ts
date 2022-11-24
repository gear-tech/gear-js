import { Hex } from '@gear-js/api';

type MailMessage = {
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
