import { ReactNode, useMemo } from 'react';

import { LocalStorage, NODE_ADDRESS } from 'shared/config';

import { getNodeAddressFromUrl } from './helpers';
import { AppContext } from './Context';

type Props = {
  children: ReactNode;
};

const AppProvider = ({ children }: Props) => {
  const values = useMemo(
    () => ({
      nodeAddress: getNodeAddressFromUrl() || localStorage.getItem(LocalStorage.NodeAddress) || NODE_ADDRESS,
    }),
    [],
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export { AppProvider };
