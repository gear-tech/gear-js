import { getWasmMetadata, Metadata } from '@gear-js/api';
import { useEffect, useState } from 'react';

function useMetadata(source: string | undefined) {
  const [metadata, setMetadata] = useState<Metadata>();
  const [metaBuffer, setMetaBuffer] = useState<Buffer>();

  useEffect(() => {
    if (source)
      fetch(source)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => Buffer.from(arrayBuffer))
        .then(async (buffer) => ({ buffer, meta: await getWasmMetadata(buffer) }))
        .then(({ meta, buffer }) => {
          setMetadata(meta);
          setMetaBuffer(buffer);
        });
  }, [source]);

  return { metadata, metaBuffer };
}

function useConditionalMeta(metaSourceOrData: string | Metadata | undefined) {
  const isSource = typeof metaSourceOrData === 'string';
  const meta = useMetadata(isSource ? metaSourceOrData : undefined);
  return isSource ? meta.metadata : metaSourceOrData;
}

function useConditionalMetaBuffer(metaSourceOrBuffer: string | Buffer | undefined) {
  const isSource = typeof metaSourceOrBuffer === 'string';
  const meta = useMetadata(isSource ? metaSourceOrBuffer : undefined);
  return isSource ? meta.metaBuffer : metaSourceOrBuffer;
}

export { useMetadata, useConditionalMeta, useConditionalMetaBuffer };
