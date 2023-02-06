import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';

type Program = {
  isPending: boolean;
  setIsPending: Dispatch<SetStateAction<boolean>>;
};

export const AppCtx = createContext({} as Program);

const useProgram = (): Program => {
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    console.log({ isPending });
  }, [isPending]);

  return {
    isPending,
    setIsPending,
  };
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { Provider } = AppCtx;
  return <Provider value={useProgram()}>{children}</Provider>;
}
