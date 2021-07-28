export interface BlockModel {
    hash: string;
    number: number;
}

export interface TotalIssuanceModel {
    totalIssuance: string;
}

export enum BlockActionTypes{
    FETCH_BLOCK_SUCCESS = 'FETCH_BLOCK_SUCCESS',
    FETCH_TOTALISSUANCE_SUCCESS = 'FETCH_TOTALISSUANCE_SUCCESS',
}

export interface BlocksState {
    totalIssuance: TotalIssuanceModel | null;
    blocks: BlockModel[];
    loading: boolean,
    error: null|string;
}

interface FetchBlockSuccessAction{
    type: BlockActionTypes.FETCH_BLOCK_SUCCESS;
    payload: BlockModel;
}
interface FetchTotalIssuanceSuccessAction{
    type: BlockActionTypes.FETCH_TOTALISSUANCE_SUCCESS;
    payload: TotalIssuanceModel;
}

export type BlockAction = FetchTotalIssuanceSuccessAction | FetchBlockSuccessAction;