import { Hex } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';

export type Message = {
  dest: Hex;
  id: Hex;
  payload: AnyJson;
  reply: string[];
  source: Hex;
  value: string;
};
