import { useContext } from 'react';
import { AccountContext } from 'context';

const useAccount = () => useContext(AccountContext);

export default useAccount;
