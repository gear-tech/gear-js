import { useContext } from 'react';
import { AppContext } from 'app/providers/app';

const useApp = () => useContext(AppContext);

export { useApp };
