import React, { ReactNode } from 'react';
import { MetaFormStruct } from './meta-parser';

export const MetaFormContext = React.createContext<MetaFormStruct>({
  __root: null,
  __values: null,
});

export function MetaFormContextProvider({ children, data }: { children: ReactNode; data: MetaFormStruct }) {
  return <MetaFormContext.Provider value={data}>{children}</MetaFormContext.Provider>;
}
