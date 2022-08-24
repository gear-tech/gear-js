import { Hex } from '@gear-js/api';

type Node = {
  isCustom: boolean;
  address: string;
};

type NodeSection = {
  caption: string;
  nodes: Node[];
};

type GetDefaultNodesResponse = NodeSection[];

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

type HumanMailboxItem = [MailMessage, Interval];

type HumanWaitlistItem = [WaitlistContent, Interval];

export type { HumanMailboxItem, HumanWaitlistItem, GetDefaultNodesResponse };
