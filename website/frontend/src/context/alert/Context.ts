import { createContext } from 'react';

import { AlertContainerFactory } from './types';

const AlertContext = createContext({} as AlertContainerFactory);

export { AlertContext };
