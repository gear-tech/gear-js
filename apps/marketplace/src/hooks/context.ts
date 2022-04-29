import { useContext } from 'react';
import { AccountContext, ApiContext, IPFSContext } from 'context';

const useAccount = () => useContext(AccountContext);
const useApi = () => useContext(ApiContext);
const useIPFS = () => useContext(IPFSContext);

export { useAccount, useApi, useIPFS };
