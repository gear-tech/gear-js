import type { HexString } from '@gear-js/api';
import { useSailsInit } from '@gear-js/react-hooks';
import { useState } from 'react';

import type { ParsedSails } from '../types';

import { useSails } from './use-sails';

function useSailsWithFile(codeId: HexString | undefined) {
  const sailsInit = useSailsInit();
  const { sails: storageSails, isLoading: isStorageSailsLoading } = useSails(codeId);

  const [fileSails, setFileSails] = useState<ParsedSails>();
  const [fileIdl, setFileIdl] = useState<string>();

  const set = (_idl: string) => {
    if (!sailsInit) throw new Error('Sails is not initialized');

    setFileSails(sailsInit(_idl));
    setFileIdl(_idl);
  };

  const reset = () => {
    setFileSails(undefined);
    setFileIdl(undefined);
  };

  const value = fileSails || storageSails;
  const idl = fileIdl;
  const isLoading = isStorageSailsLoading;
  // redudant, id idl is present it's always from file. keeping for consistency with metadata structure
  const isFromStorage = Boolean(storageSails);

  return { value, idl, isLoading, isFromStorage, set, reset };
}

export { useSailsWithFile };
