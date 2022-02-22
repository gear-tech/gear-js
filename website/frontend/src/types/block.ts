export interface BlockModel {
  hash: string;
  number: number;
  time: string;
}

export interface TotalIssuanceModel {
  totalIssuance: string;
}

export enum BlockActionTypes {
  FETCH_BLOCK = 'FETCH_BLOCK',
  FETCH_TOTALISSUANCE = 'FETCH_TOTALISSUANCE',
  RESET_BLOCKS = 'RESET_BLOCKS',
}

export interface BlocksState {
  totalIssuance: TotalIssuanceModel | null;
  blocks: BlockModel[];
  loading: boolean;
  error: null | string;
}

interface FetchBlockAction {
  type: BlockActionTypes.FETCH_BLOCK;
  payload: BlockModel;
}
interface FetchTotalIssuanceAction {
  type: BlockActionTypes.FETCH_TOTALISSUANCE;
  payload: TotalIssuanceModel;
}

interface ResetBlocksAction {
  type: BlockActionTypes.RESET_BLOCKS;
}

export type BlockAction = FetchTotalIssuanceAction | FetchBlockAction | ResetBlocksAction;
