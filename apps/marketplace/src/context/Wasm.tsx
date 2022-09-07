import { getWasmMetadata, Hex, Metadata } from '@gear-js/api';
import { ProviderProps, useAlert } from '@gear-js/react-hooks';
import { createContext, useEffect, useState } from 'react';
import { ADDRESS } from 'consts';

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
  [key in 'nft' | 'marketplace']: Program;
};

const WasmContext = createContext<Programs>({} as Programs);

function useWasmRequest(name: string) {
  const alert = useAlert();
  const [program, setProgram] = useState<Program>();

  useEffect(() => {
    const params = new URLSearchParams({ name });
    const url = `${ADDRESS.DAPPS_API}?${params}`;

    fetch(url)
      .then((response) => response.json() as Promise<Result>)
      .then(({ metaWasmBase64, id }) => ({ metaBuffer: Buffer.from(metaWasmBase64, 'base64'), programId: id }))
      .then(async ({ metaBuffer, programId }) => ({ metaBuffer, programId, meta: await getWasmMetadata(metaBuffer) }))
      .then((result) => setProgram(result))
      .catch(({ message }: Error) => alert.error(message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return program;
}

function WasmProvider({ children }: ProviderProps) {
  const nft = useWasmRequest('#nft');
  const marketplace = useWasmRequest('nft_marketplace');

  const { Provider } = WasmContext;

  return <Provider value={{ nft, marketplace } as Programs}>{children}</Provider>;
}

export { WasmContext, WasmProvider };
