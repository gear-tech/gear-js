import { createContext, useContext, Dispatch } from 'react';
import { Actions, State } from './reducer';
import { EditorItem } from '../../../../types/editor';

export type TreeState = {
  dispatch: Dispatch<Actions> | null;
  state: State;
  onNodeClick: (node: EditorItem) => void;
};

export const defaultState: TreeState = {
  dispatch: null,
  state: {
    tree: null,
  },
  onNodeClick: () => {},
};

export const EditorTreeContext = createContext(defaultState);

export const useEditorTreeContext = () => useContext(EditorTreeContext);
