import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { StoreItemType } from 'app/types/ft-store';

type Program = {
  items: StoreItemType[];
  setItems: Dispatch<SetStateAction<StoreItemType[]>>;
};

export const ItemsStoreCtx = createContext({} as Program);

const useProgram = (): Program => {
  const [items, setItems] = useState<StoreItemType[]>([]);

  return {
    items,
    setItems,
  };
};

export function ItemsStoreProvider({ children }: { children: ReactNode }) {
  const { Provider } = ItemsStoreCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
