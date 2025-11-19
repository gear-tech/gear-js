import { useContext } from 'react';

import { ApiContext } from './context';

export const useGearExeApi = () => useContext(ApiContext);
