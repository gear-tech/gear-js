import { IPFSContext } from 'context';
import { useContext } from 'react';

const useIPFS = () => useContext(IPFSContext);

export { useIPFS };
