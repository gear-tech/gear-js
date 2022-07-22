import { Hex } from '../../common';

export interface HumanMessage {
  id: Hex;
  source: Hex;
  destination: Hex;
  payload: Hex | string;
  gas_limit: string;
  value: string;
  reply: null | { exitCode: number; replyTo: Hex };
}

export type HumanStoredMessage = Omit<HumanMessage, 'gas_limit'>;
