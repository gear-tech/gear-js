import { Hex } from '@gear-js/api';

type Token = {
  approvedAccountIds: Hex[];
  description: string;
  id: string;
  media: string;
  name: string;
  ownerId: Hex;
  reference: string;
};

export type { Token };
