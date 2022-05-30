import { useContext } from 'react';
import { AccountContext, AlertContext, ApiContext } from 'context';

const useAccount = () => useContext(AccountContext);
const useAlert = () => useContext(AlertContext);
const useApi = () => useContext(ApiContext);

export { useAccount, useAlert, useApi };
