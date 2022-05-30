import { useContext } from 'react';
import { AccountContext, ApiContext } from 'context';

const useAccount = () => useContext(AccountContext);
const useApi = () => useContext(ApiContext);

export { useAccount, useApi };
