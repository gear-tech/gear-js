import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { ItemsStoreResponse, StoreItemType } from 'app/types/ft-store';

type Program = {
  store?: ItemsStoreResponse;
  setStore: Dispatch<SetStateAction<ItemsStoreResponse | undefined>>;
  items: StoreItemType[];
  setItems: Dispatch<SetStateAction<StoreItemType[]>>;
};

export const ItemsStoreCtx = createContext({} as Program);

const useProgram = (): Program => {
  const [items, setItems] = useState<StoreItemType[]>([]);
  const [store, setStore] = useState<ItemsStoreResponse>();

  return {
    items,
    setItems,
    store,
    setStore,
  };
};

export function ItemsStoreProvider({ children }: { children: ReactNode }) {
  const { Provider } = ItemsStoreCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
