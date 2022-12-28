import { getProgramMetadata, getWasmMetadata, Hex } from '@gear-js/api';
import { ProviderProps, useAlert, useApi, useMetadata } from '@gear-js/react-hooks';
import { createContext, useEffect, useState } from 'react';
import { ADDRESS } from 'app/consts';
import txt from 'assets/meta/meta.txt';
// import meta from 'assets/meta/tmg.meta.wasm';
import { Metadata } from '@polkadot/types';

type Result = {
  id: Hex;
  codeHash: Hex;
  metaWasmBase64: string;
  name: string;
  repo: string;
  updatedAt: string;
};

type Program = {
  programId: Hex;
  // codeHash: Hex;
  metaBuffer: Buffer;
  meta: Metadata;
};

export const WasmContext = createContext<Program>({} as Program);

function useWasmRequest(name: string) {
  const alert = useAlert();
  const [test, setTest] = useState<any>();
  // const { metaBuffer, metadata } = useMetadata(meta);
  const program = {
    programId: '0x4544c718d4aa1545dc3db3327c1e79d26fe9c0e17a13cb4d7de355cc83715b4a' as Hex,
    metaBuffer: {} as Buffer,
    meta: {},
  };
  // useEffect(() => {
  //   const params = new URLSearchParams({ name });
  //   const url = `${ADDRESS.DAPPS_API}?${params}`;
  //   fetch(url)
  //     .then((response) => response.json() as Promise<Result>)
  //     .then(({ id, codeHash, metaWasmBase64 }) => ({
  //       codeHash,
  //       metaBuffer: Buffer.from(metaWasmBase64, 'base64'),
  //       programId: id,
  //     }))
  //     .then(async ({ metaBuffer, programId, codeHash }) => ({
  //       codeHash,
  //       metaBuffer,
  //       programId,
  //       meta: await getWasmMetadata(metaBuffer),
  //     }))
  //     .then((result) => setProgram(result))
  //     .catch(({ message }: Error) => alert.error(message));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [name]);

  return program;
}

export function WasmProvider({ children }: ProviderProps) {
  const program = useWasmRequest('tamagotchi');
  const { Provider } = WasmContext;
  return <Provider value={program as Program}>{children}</Provider>;
}
