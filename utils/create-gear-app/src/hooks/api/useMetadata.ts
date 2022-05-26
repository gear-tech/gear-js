import { getWasmMetadata, Metadata } from '@gear-js/api';
import { useEffect, useState } from 'react';

function useMetadata(source: RequestInfo) {
  const [metadata, setMetadata] = useState<Metadata>();
  const [metaBuffer, setMetaBuffer] = useState<Buffer>();

  useEffect(() => {
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

export { useMetadata };
