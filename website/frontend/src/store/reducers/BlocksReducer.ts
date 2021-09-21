import { BlocksState, BlockActionTypes, BlockAction } from 'types/block';

const initialState: BlocksState = {
  totalIssuance: null,
  blocks: [],
  loading: false,
  error: null,
};

const BlockReducer = (state = initialState, action: BlockAction): BlocksState => {
  switch (action.type) {
    case BlockActionTypes.FETCH_TOTALISSUANCE:
      return { ...state, totalIssuance: action.payload };

    case BlockActionTypes.FETCH_BLOCK: {
      const prevBlocks = [...state.blocks];
      if (prevBlocks.length === 10) prevBlocks.pop();
      return { ...state, blocks: [action.payload, ...prevBlocks] };
    }

    case BlockActionTypes.RESET_BLOCKS:
      return { ...initialState };

    default:
      return state;
  }
};

export default BlockReducer;
