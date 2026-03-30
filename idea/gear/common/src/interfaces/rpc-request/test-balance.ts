import { IGenesis } from '../common.js';

export interface GetTestBalanceParams extends IGenesis {
  address: string;
  token: string;
}
