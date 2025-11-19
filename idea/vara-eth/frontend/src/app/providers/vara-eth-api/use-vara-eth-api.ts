import { useContext } from 'react';

import { ApiContext } from './context';

export const useVaraEthApi = () => useContext(ApiContext);
