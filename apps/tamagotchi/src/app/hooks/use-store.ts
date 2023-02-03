import { useEffect, useState } from 'react';
import { useReadFullState } from '@gear-js/react-hooks';
import { useLesson } from 'app/context';
import { StoreItemType, ItemsStoreResponse } from 'app/types/ft-store';
import { ENV } from '../consts';
import { useMetadata } from './use-metadata';
import metaStore from 'assets/meta/meta-store.txt';

function useReadItemsStore<T>() {
  const { metadata } = useMetadata(metaStore);
  return useReadFullState<T>(ENV.store, metadata);
}

export function useItemsStore() {
  const { state } = useReadItemsStore<ItemsStoreResponse>();
  const { lesson, setTamagotchiItems } = useLesson();
  const [items, setItems] = useState<StoreItemType[]>([]);

  useEffect(() => {
    if (lesson?.programId && lesson.step > 3) {
      const getItems = () => {
        const result: StoreItemType[] = [];
        for (const idx in state?.attributes) {
          result.push({
            id: +idx,
            amount: state?.attributes[+idx][1],
            description: state?.attributes[+idx][0],
          } as StoreItemType);
        }
        return result;
      };
      setTamagotchiItems(state ? state.owners[lesson.programId] : []);
      setItems(getItems());
    }
    return () => setItems([]);
  }, [lesson, state]);

  return { items };
}
