import { createContext, Dispatch, SetStateAction } from 'react';

type Value = {
  isBuildDone: boolean;
  setIsBuildDone: Dispatch<SetStateAction<boolean>>;
};

const EditorContext = createContext({} as Value);

export { EditorContext };
