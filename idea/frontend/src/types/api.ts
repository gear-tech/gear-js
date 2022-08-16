import { Hex } from '@gear-js/api';

export type Node = {
  isCustom: boolean;
  address: string;
};

export type NodeSection = {
  caption: string;
  nodes: Node[];
};

export type GetMetaResponse = {
  meta: string;
  metaFile: string;
  program: string;
};

export type GetDefaultNodesResponse = NodeSection[];

export type MailMessage = {
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
  start: string;
  finish: string;
};

export type Context = {
  awaken: any[];
  initialized: any[];
  outgoing: {};
  reply: null;
  replySent: boolean;
};

export type WaitlistContent = {
  context: Context;
  message: MailMessage;
  kind: string;
};

export type HumanMailboxItem = [MailMessage, Interval];

export type HumanWaitlistItem = [WaitlistContent, Interval];
