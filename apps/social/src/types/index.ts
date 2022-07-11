import { Hex } from '@gear-js/api';

type Params = {
  id: string;
};

type Channel = {
  id: Hex;
  name: string;
  ownerId: Hex;
  description: string;
};

export type { Params, Channel };
