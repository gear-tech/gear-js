import { useContext } from 'react';
import AccountContext from './Context';
import AccountProvider from './Provider';

const useAccount = () => useContext(AccountContext);

export { AccountProvider, useAccount };
