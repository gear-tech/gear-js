import { useEffect } from 'react';
import { useReadFullState } from '@gear-js/react-hooks';
import { useFTStore, useLesson } from 'app/context';
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
  const { lesson, setTamagotchiItems } = useLesson();
  const { setItems } = useFTStore();
  const { state } = useReadItemsStore<ItemsStoreResponse>();

  useEffect(() => {
    if (lesson && lesson.step > 3 && state) {
      const { programId } = lesson;
      setItems(getStoreItems(state, programId).store);
      setTamagotchiItems(getStoreItems(state, programId).tamagotchi);
    }
    return () => setItems([]);
  }, [lesson, state]);
}
