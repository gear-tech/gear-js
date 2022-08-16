import { Hex } from '@gear-js/api';

type InitPayload = {
  ftProgramId: Hex;
  nftProgramId: Hex;
  producers: Hex[];
  distributors: Hex[];
  retailers: Hex[];
};

type Item = {
  producer: Hex;
  distributor: Hex;
  retailer: Hex;
  state: string;
  price: string;
  deliveryTime: string;
};

export type { InitPayload, Item };
