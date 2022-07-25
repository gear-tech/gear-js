import { Hex } from '@gear-js/api';

export type MailboxMessage = {
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

export type Interval = {
  start: number;
  finish: number;
};

export type HumanMailboxItem = [MailboxMessage, Interval];
