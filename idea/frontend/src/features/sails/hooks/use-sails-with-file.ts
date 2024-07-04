import { HexString } from '@gear-js/api';
import { useState } from 'react';
import { Sails } from 'sails-js';

import { SAILS } from '../consts';
import { useSails } from './use-sails';

function useSailsWithFile(codeId: HexString | undefined) {
  const { sails: storageSails, idl: storageIdl, isLoading: isStorageSailsLoading } = useSails(codeId);

  const [fileSails, setFileSails] = useState<Sails>();
  const [fileIdl, setFileIdl] = useState<string>();

  const set = (_idl: string) => {
    setFileSails(SAILS.parseIdl(_idl));
    setFileIdl(_idl);
  };

  const reset = () => {
    setFileSails(undefined);
    setFileIdl(undefined);
  };

  const value = fileSails || storageSails;
  const idl = fileIdl || storageIdl;
  const isLoading = isStorageSailsLoading;
  const isFromStorage = Boolean(storageSails);

  return { value, idl, isLoading, isFromStorage, set, reset };
}

export { useSailsWithFile };
