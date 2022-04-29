import { create, IPFS } from 'ipfs-core';
import { createContext, useEffect, useState } from 'react';
import Props from './types';

const IPFSContext = createContext<IPFS | undefined>({} as IPFS);

function IPFSProvider({ children }: Props) {
  const [ipfs, setIpfs] = useState<IPFS>();

  const { Provider } = IPFSContext;

  useEffect(() => {
    create().then(setIpfs);
  }, []);

  return <Provider value={ipfs}>{children}</Provider>;
}

export { IPFSContext, IPFSProvider };
