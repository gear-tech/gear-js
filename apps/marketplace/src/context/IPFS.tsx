import { ProviderProps } from '@gear-js/react-hooks';
import { createContext, useRef } from 'react';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { ADDRESS } from 'consts';

const IPFSContext = createContext<IPFSHTTPClient>({} as IPFSHTTPClient);

function IPFSProvider({ children }: ProviderProps) {
  const ipfsRef = useRef(create({ url: ADDRESS.IPFS }));

  const { Provider } = IPFSContext;

  return <Provider value={ipfsRef.current}>{children}</Provider>;
}

export { IPFSContext, IPFSProvider };
