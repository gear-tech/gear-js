import { useContext } from 'react';
import { BlocksContext } from 'app/providers/blocks';

const useBlocks = () => useContext(BlocksContext);

export { useBlocks };
