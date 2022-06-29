import { useContext } from 'react';
import { IPFSContext } from 'context';

const useIPFS = () => useContext(IPFSContext);

export { useIPFS };
