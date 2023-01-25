import type { Hex } from '@gear-js/api';
import type { ProviderProps } from '@gear-js/react-hooks';
import { createContext } from 'react';
import { ProgramMetadata } from '@gear-js/api';
import { useMetadata } from '../hooks/use-metadata';
import meta from 'assets/meta/meta-ft.txt';
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
    programId: ENV.balance as Hex,
    meta: metadata as ProgramMetadata,
  };
}

export const TokensBalanceCtx = createContext<Program>(program);

export function TokensBalanceProvider({ children }: ProviderProps) {
  const { Provider } = TokensBalanceCtx;
  return <Provider value={useStore()}>{children}</Provider>;
}
