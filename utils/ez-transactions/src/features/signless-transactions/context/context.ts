import { createContext } from 'react';
import { SignlessContext } from './types';
import { DEFAULT_SIGNLESS_CONTEXT } from './consts';

const SignlessTransactionsContext = createContext<SignlessContext>(DEFAULT_SIGNLESS_CONTEXT);

export { SignlessTransactionsContext };
