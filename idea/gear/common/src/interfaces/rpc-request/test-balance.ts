import type { IGenesis } from '../common';

export interface GetTestBalanceParams extends IGenesis {
  address: string;
  token: string;
}
