import type { Hex } from '@gear-js/api';
import type { ProviderProps } from '@gear-js/react-hooks';
import { createContext } from 'react';
import { Metadata } from '@polkadot/types';

type Program = {
  programId: Hex;
  metaBuffer: Buffer;
  meta: Metadata;
};

const program: Program = {
  programId: '' as Hex,
  metaBuffer: {} as Buffer,
  meta: {} as Metadata,
};

export const WasmContext = createContext<Program>(program);

export function WasmProvider({ children }: ProviderProps) {
  const { Provider } = WasmContext;
  return <Provider value={program as Program}>{children}</Provider>;
}
