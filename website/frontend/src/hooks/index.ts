import { useContext } from 'react';
import { ApiContext } from 'context/api';

export const useApi = () => useContext(ApiContext);
