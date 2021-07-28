import { BlocksState, BlockActionTypes, BlockAction } from 'types/block';

const initialState: BlocksState = {
    totalIssuance: null,
    blocks: [],
    loading: false,
    error: null,
};

const BlockReducer = (state = initialState, action: BlockAction): BlocksState => {
  switch (action.type) {
    case BlockActionTypes.FETCH_TOTALISSUANCE_SUCCESS:
        return { ...state, totalIssuance: action.payload };

    case BlockActionTypes.FETCH_BLOCK_SUCCESS:
        return { ...state, blocks: [action.payload, ...state.blocks] };

    default:
      return state;
  }
};

export default BlockReducer;
