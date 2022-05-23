import { useContext } from 'react';
import { AccountContext, ApiContext } from 'context';

const useAccount = () => useContext(AccountContext);
const useApi = () => useContext(ApiContext);
// const useIPFS = () => useContext(IPFSContext);
// const useLoading = () => useContext(LoadingContext);

export { useAccount, useApi };
