import { Hex } from '@gear-js/api';

type NFT = {
  id: string;
  name: string;
  description: string;
  media: string;
  reference: string;
  ownerId: Hex;
  approvedAccountIds: Hex[];
};

export default NFT;
