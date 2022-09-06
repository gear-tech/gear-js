import { getWasmMetadata, Hex, Metadata } from '@gear-js/api';
import { ProviderProps } from '@gear-js/react-hooks';
import { ADDRESS } from 'consts';
import { createContext, useEffect, useState } from 'react';

type Result = {
  id: Hex;
  metaWasmBase64: string;
  name: string;
  repo: string;
  updatedAt: string;
};

type Program = {
  programId: Hex;
  metaBuffer: Buffer;
  meta: Metadata;
};

type Programs = {
  [key in 'nft' | 'marketplace']: Program | undefined;
};

const WasmContext = createContext<Programs>({} as Programs);

function useWasmRequest(name: string) {
  const [program, setProgram] = useState<Program>();

  useEffect(() => {
    const params = new URLSearchParams({ name });
    const url = `${ADDRESS.DAPPS_API}?${params}`;

    fetch(url)
      .then((response) => response.json() as Promise<Result>)
      .then(({ metaWasmBase64, id }) => ({ metaBuffer: Buffer.from(metaWasmBase64, 'base64'), programId: id }))
      .then(async ({ metaBuffer, programId }) => ({ metaBuffer, programId, meta: await getWasmMetadata(metaBuffer) }))
      .then((result) => setProgram(result));
  }, [name]);

  return program;
}

function WasmProvider({ children }: ProviderProps) {
  const nft = useWasmRequest('#nft');
  const marketplace = useWasmRequest('nft_marketplace');

  const { Provider } = WasmContext;

  return <Provider value={{ nft, marketplace }}>{children}</Provider>;
}

export { WasmContext, WasmProvider };
