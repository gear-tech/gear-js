import { HexString, ProgramMetadata } from '@gear-js/api';
import { useState, useMemo } from 'react';

import { useMetadata } from './use-metadata';

// upload-metadata feature?
function useMetadataWithFile(hash: HexString | null | undefined) {
  const { metadataHex: storageMetadataHex, isMetadataReady: isStorageMetadataReady } = useMetadata(hash);

  const [fileMetadataHex, setFileMetadataHex] = useState<HexString>();
  const resetFileMetadataHex = () => setFileMetadataHex(undefined);

  const metadataHex = fileMetadataHex || storageMetadataHex;
  const metadata = useMemo(() => (metadataHex ? ProgramMetadata.from(metadataHex) : undefined), [metadataHex]);
  const isMetadataReady = isStorageMetadataReady || Boolean(fileMetadataHex);
  const isStorageMetadata = Boolean(storageMetadataHex);

  return {
    hash,
    value: metadata,
    hex: metadataHex,
    isReady: isMetadataReady,
    isFromStorage: isStorageMetadata,
    set: setFileMetadataHex,
    reset: resetFileMetadataHex,
  };
}

export { useMetadataWithFile };
