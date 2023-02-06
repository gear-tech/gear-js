import { useEffect } from 'react';
import { useReadFullState } from '@gear-js/react-hooks';
import { useFTStore, useLessons, useTamagotchi } from 'app/context';
import { ItemsStoreResponse } from 'app/types/ft-store';
import { ENV } from '../consts';
import { useMetadata } from './use-metadata';
import metaStore from 'assets/meta/meta-store.txt';
import { getStoreItems } from '../utils';

function useReadItemsStore<T>() {
  const { metadata } = useMetadata(metaStore);
  return useReadFullState<T>(ENV.store, metadata);
}

export function useItemsStore() {
  const { setTamagotchiItems } = useTamagotchi();
  const { lesson } = useLessons();
  const { setItems, setStore } = useFTStore();
  const { state } = useReadItemsStore<ItemsStoreResponse>();

  useEffect(() => {
    setStore(state);

    return () => {
      setStore(undefined);
    };
  }, [state]);

  useEffect(() => {
    if (lesson && lesson.step > 3 && state) {
      const { programId } = lesson;
      setItems(getStoreItems(state, programId).store);
      setTamagotchiItems(getStoreItems(state, programId).tamagotchi);
    } else {
      setItems([]);
      setTamagotchiItems([]);
    }
    return () => {
      setItems([]);
      setTamagotchiItems([]);
    };
  }, [lesson, state]);
}
