import React, { ReactNode } from 'react';
import { MetaFieldsStruct } from './meta-parser';

export const MetaFieldsContext = React.createContext<MetaFieldsStruct>({
  __root: null,
  __values: null,
});

export function MetaFieldsContextProvider({ children, data }: { children: ReactNode; data: MetaFieldsStruct }) {
  return <MetaFieldsContext.Provider value={data}>{children}</MetaFieldsContext.Provider>;
}
