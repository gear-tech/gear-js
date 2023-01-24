import { ProgramMetadata, Hex, getProgramMetadata } from '@gear-js/api';
import { useState, useEffect } from 'react';

function useMetadata(source: string) {
  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    fetch(source)
      .then((result) => result.text())
      .then((text) => `0x${text}` as Hex)
      .then((metaHex) => getProgramMetadata(metaHex))
      .then((meta) => setMetadata(meta));
  }, [source]);

  return metadata;
}

export { useMetadata };
