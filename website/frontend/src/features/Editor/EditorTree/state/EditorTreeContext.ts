import { createContext, useContext, Dispatch } from 'react';
import { Actions, State } from './reducer';
import { EditorItem } from '../../../../types/editor';

export type TreeState = {
  dispatch: Dispatch<Actions>;
  onNodeClick: (node: EditorItem) => void;
  state: State;
};

export const defaultState: TreeState = {
  dispatch: () => {},
  onNodeClick: () => {},
  state: {
    tree: null,
  },
};

export const EditorTreeContext = createContext(defaultState);

export const useEditorTreeContext = () => useContext(EditorTreeContext);
