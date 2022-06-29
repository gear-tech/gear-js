import { ProviderProps } from '@gear-js/react-hooks';
import { createContext, useRef } from 'react';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { IPFS_ADDRESS } from 'consts';

const IPFSContext = createContext<IPFSHTTPClient>({} as IPFSHTTPClient);

function IPFSProvider({ children }: ProviderProps) {
  const ipfsRef = useRef(create({ url: IPFS_ADDRESS }));

  const { Provider } = IPFSContext;

  return <Provider value={ipfsRef.current}>{children}</Provider>;
}

export { IPFSContext, IPFSProvider };
