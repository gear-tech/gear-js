import { Hex } from '@gear-js/api';

type NFT = {
  ownerId: Hex;
  title: string;
  description: string;
  media: string;
  reference: string;
  approvedAccountIds: Hex[];
};

export default NFT;
