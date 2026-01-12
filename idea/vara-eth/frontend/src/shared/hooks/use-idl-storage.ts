import { HexString } from '@vara-eth/api';
import { useState, useEffect } from 'react';

const IDL_STORAGE_PREFIX = 'vara-eth-idl';

const getIdlStorageKey = (codeId: HexString) => `${IDL_STORAGE_PREFIX}-${codeId}`;

type UseIdlStorageReturn = {
  idl: string | null;
  saveIdl: (idlContent: string) => void;
};

export const useIdlStorage = (codeId?: HexString): UseIdlStorageReturn => {
  const [idl, setIdl] = useState<string | null>(codeId ? localStorage.getItem(getIdlStorageKey(codeId)) : null);

  useEffect(() => {
    setIdl(codeId ? localStorage.getItem(getIdlStorageKey(codeId)) : null);
  }, [codeId]);

  const saveIdl = (idlContent: string) => {
    if (!codeId) {
      console.error('Code ID is not found');
      return;
    }
    localStorage.setItem(getIdlStorageKey(codeId), idlContent);
    setIdl(idlContent);
  };

  return { idl, saveIdl };
};
