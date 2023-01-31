import { useEffect, useState } from 'react';
import { AnyJson } from '@polkadot/types/types';
import { useReadState } from './use-read-state';
import { useLesson } from 'app/context';
import { StoreItemType, ItemsStoreResponse } from 'app/types/ft-store';

function useReadItemsStore<T>(payload: AnyJson) {
  const { store } = useLesson();
  return useReadState<T>(store.programId, store.meta, payload);
}

const payload = {};

export function useItemsStore() {
  const { state } = useReadItemsStore<ItemsStoreResponse>(payload);
  const { lesson, setTamagotchiItems } = useLesson();
  const [items, setItems] = useState<StoreItemType[]>([]);

  useEffect(() => {
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
    setTamagotchiItems(lesson && state ? state.owners[lesson.programId] : []);
    setItems(getItems());

    return () => setItems([]);
  }, [lesson, state]);

  return { items };
}
