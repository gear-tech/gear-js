import { Hex } from '@gear-js/api';

type InitPayload = {
  ftProgramId: Hex;
  nftProgramId: Hex;
  producers: Hex[];
  distributors: Hex[];
  retailers: Hex[];
};

export type { InitPayload };
