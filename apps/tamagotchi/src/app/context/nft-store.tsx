import type { Hex } from '@gear-js/api';
import type { ProviderProps } from '@gear-js/react-hooks';
import { createContext } from 'react';
import { ProgramMetadata } from '@gear-js/api';
import { useMetadata } from '../hooks/use-metadata';
import meta from 'assets/meta/meta4.txt';
import { ENV } from '../consts';

type Program = {
  programId: Hex;
  meta: ProgramMetadata;
};

const program: Program = {
  programId: '' as Hex,
  meta: {} as ProgramMetadata,
};

function useStore(): Program {
  const { metadata } = useMetadata(meta);
  return {
    programId: ENV.store as Hex,
    meta: metadata as ProgramMetadata,
  };
}

export const NFTStoreContext = createContext<Program>(program);

export function NFTStoreProvider({ children }: ProviderProps) {
  const { Provider } = NFTStoreContext;
  return <Provider value={useStore()}>{children}</Provider>;
}
