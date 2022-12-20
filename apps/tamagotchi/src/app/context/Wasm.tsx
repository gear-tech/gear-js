import { getWasmMetadata, Hex, Metadata } from '@gear-js/api';
import { ProviderProps, useAlert } from '@gear-js/react-hooks';
import { createContext, useEffect, useState } from 'react';
import { ADDRESS } from 'app/consts';

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
  codeHash: Hex;
  metaBuffer: Buffer;
  meta: Metadata;
};

export const WasmContext = createContext<Program>({} as Program);

function useWasmRequest(name: string) {
  const alert = useAlert();
  const [program, setProgram] = useState<Program>({
    programId: '' as Hex,
    codeHash: '0x00',
    metaBuffer: {} as Buffer,
    meta: {},
  });
  useEffect(() => {
    const params = new URLSearchParams({ name });
    const url = `${ADDRESS.DAPPS_API}?${params}`;
    fetch(url)
      .then((response) => response.json() as Promise<Result>)
      .then(({ id, codeHash, metaWasmBase64 }) => ({
        codeHash,
        metaBuffer: Buffer.from(metaWasmBase64, 'base64'),
        programId: id,
      }))
      .then(async ({ metaBuffer, programId, codeHash }) => ({
        codeHash,
        metaBuffer,
        programId,
        meta: await getWasmMetadata(metaBuffer),
      }))
      .then((result) => setProgram(result))
      .catch(({ message }: Error) => alert.error(message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return program;
}

export function WasmProvider({ children }: ProviderProps) {
  const program = useWasmRequest('tamagotchi');
  const { Provider } = WasmContext;
  return <Provider value={program as Program}>{children}</Provider>;
}
