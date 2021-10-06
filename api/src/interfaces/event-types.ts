import { Bytes } from '@polkadot/types';

export declare type InitSuccessData = [
  {
    messageId: string;
    programId: string;
    origin: string;
  }
];

export declare type InitFailureData = [
  {
    messageId: string;
    programId: string;
    origin: string;
  }
];

export declare type LogData = [
  {
    id: string;
    source: string;
    dest: string;
    payload: string | Bytes;
    gasLimit: number;
    value: number;
    reply: [string, number];
  }
];
