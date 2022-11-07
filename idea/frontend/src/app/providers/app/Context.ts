import { createContext } from 'react';

import { AppValues } from './types';

const AppContext = createContext<AppValues>({} as AppValues);

export { AppContext };
