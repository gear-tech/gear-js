import { HexString } from '@vara-eth/api';
import { useSyncExternalStore, useCallback } from 'react';

const IDL_STORAGE_PREFIX = 'vara-eth-idl';

const getIdlStorageKey = (codeId: HexString) => `${IDL_STORAGE_PREFIX}-${codeId}`;

type UseIdlStorageReturn = {
  idl: string | null;
  saveIdl: (idlContent: string) => void;
};

// Storage event listeners to sync across components
const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useIdlStorage = (codeId?: HexString): UseIdlStorageReturn => {
  const getSnapshot = useCallback(() => {
    if (!codeId) return null;

    return localStorage.getItem(getIdlStorageKey(codeId));
  }, [codeId]);

  const idl = useSyncExternalStore(subscribe, getSnapshot);
  const saveIdl = useCallback(
    (idlContent: string) => {
      if (!codeId) {
        console.error('Code ID is not found');
        return;
      }
      localStorage.setItem(getIdlStorageKey(codeId), idlContent);
      emitChange();
    },
    [codeId],
  );

  return { idl, saveIdl };
};
