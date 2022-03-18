import { Hex } from '@gear-js/api';

export type MessageType = {
  dest: Hex;
  id: Hex;
  payload: string | object;
  reply: [];
  source: string;
  value: string;
};
