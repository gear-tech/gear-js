import { getWasmMetadata, Metadata } from '@gear-js/api';
import { useEffect, useState } from 'react';

function useMetadata(input: RequestInfo) {
  const [metadata, setMetadata] = useState<Metadata>();
  const [metaBuffer, setMetaBuffer] = useState<Buffer>();

  const getBuffer = (arrayBuffer: ArrayBuffer) => {
    const buffer = Buffer.from(arrayBuffer);

    setMetaBuffer(buffer);
    return buffer;
  };

  useEffect(() => {
    fetch(input)
      .then((response) => response.arrayBuffer())
      .then(getBuffer)
      .then((buffer) => getWasmMetadata(buffer))
      .then(setMetadata);
  }, [input]);

  return { metadata, metaBuffer };
}

export default useMetadata;
