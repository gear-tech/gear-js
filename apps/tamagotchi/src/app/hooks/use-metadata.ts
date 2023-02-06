import { useEffect, useState } from 'react';
import { getProgramMetadata, getWasmMetadata, ProgramMetadata } from '@gear-js/api';
import { Buffer } from 'buffer';
import { useAlert } from '@gear-js/react-hooks';
import { Metadata } from '@polkadot/types';

type Program = {
  buffer: Buffer;
  meta: Metadata;
};

export const useMetadata = (source: RequestInfo | URL) => {
  const [data, setData] = useState<ProgramMetadata>();

  useEffect(() => {
    fetch(source)
      .then((res) => res.text() as Promise<string>)
      .then((raw) => getProgramMetadata(`0x${raw}`))
      .then((meta) => setData(meta));
  }, [source]);

  return { metadata: data };
};
export const useWasmMetadata = (source: RequestInfo | URL) => {
  const alert = useAlert();
  const [data, setData] = useState<Program>();

  useEffect(() => {
    if (source) {
      fetch(source)
        .then((response) => response.arrayBuffer())
        .then((array) => Buffer.from(array))
        .then(async (buffer) => ({ buffer, meta: (await getWasmMetadata(buffer)) as Metadata }))
        .then(({ meta, buffer }) => setData({ meta: meta, buffer }))
        .catch(({ message }: Error) => alert.error(`Fetch error: ${message}`));
    }
  }, [source]);

  return data;
};
