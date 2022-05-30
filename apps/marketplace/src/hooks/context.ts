import { useContext } from 'react';
import { AccountContext, ApiContext, IPFSContext, LoadingContext } from 'context';

const useAccount = () => useContext(AccountContext);
const useApi = () => useContext(ApiContext);
const useIPFS = () => useContext(IPFSContext);
const useLoading = () => useContext(LoadingContext);

export { useAccount, useApi, useIPFS, useLoading };
