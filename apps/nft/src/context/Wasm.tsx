import { getWasmMetadata, Hex, Metadata } from '@gear-js/api';
import { ProviderProps, useAlert, useMetadata } from '@gear-js/react-hooks';
import { createContext, useEffect, useState } from 'react';
import { ADDRESS } from 'consts';
import meta from 'assets/wasm/nft_street_art.meta.wasm';

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

const WasmContext = createContext<Program>({} as Program);

function useWasmRequest(name: string) {
  // const alert = useAlert();
  // const [program, setProgram] = useState<Program>();

  // useEffect(() => {
  //   const params = new URLSearchParams({ name });
  //   const url = `${ADDRESS.DAPPS_API}?${params}`;
  //
  //   fetch(url)
  //     .then((response) => response.json() as Promise<Result>)
  //     .then(({ metaWasmBase64, id }) => ({ metaBuffer: Buffer.from(metaWasmBase64, 'base64'), programId: id }))
  //     .then(async ({ metaBuffer, programId }) => ({ metaBuffer, programId, meta: await getWasmMetadata(metaBuffer) }))
  //     .then((result) => setProgram(result))
  //     .catch(({ message }: Error) => alert.error(message));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [name]);
  //
  const {metaBuffer, metadata} = useMetadata(meta)

  return ({
    metaBuffer,
    programId: ADDRESS.NFT_CONTRACT_ADDRESS,
    meta: metadata
  }) as Program

  // const { state: infoState } = useMetaWasmState<InfoState>(PAYLOAD_FOR_INFO_STATE);


  // return program;
}

function WasmProvider({ children }: ProviderProps) {
  const program = useWasmRequest('nft');
  const { Provider } = WasmContext;

  return <Provider value={program as Program}>{children}</Provider>;
}

export { WasmContext, WasmProvider };
