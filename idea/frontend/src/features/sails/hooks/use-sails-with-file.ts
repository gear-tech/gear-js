import { HexString } from '@gear-js/api';
import { useState } from 'react';
import { Sails } from 'sails-js';

import { useSails } from './use-sails';
import { useSailsInit } from './use-sails-init';

function useSailsWithFile(codeId: HexString | undefined) {
  const sails = useSailsInit();
  const { sails: storageSails, isLoading: isStorageSailsLoading } = useSails(codeId);

  const [fileSails, setFileSails] = useState<Sails>();
  const [fileIdl, setFileIdl] = useState<string>();

  const set = (_idl: string) => {
    if (!sails) throw new Error('Sails is not initialized');

    setFileSails(sails.parseIdl(_idl));
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
