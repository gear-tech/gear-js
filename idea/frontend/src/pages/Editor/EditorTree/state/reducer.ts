import { nanoid } from 'nanoid';
import { FILE, FOLDER } from './consts';
import { EditorFolderRecord, EditorTypes, NodeId } from '../../../../types/editor';
import { cloneDeep, findNode, getLangFromName } from '../utils';

export type State = {
  tree: EditorFolderRecord | null;
  error?: string;
};

export type Actions =
  | { type: 'SET_DATA'; payload: EditorFolderRecord }
  | { type: FOLDER.CREATE; payload: { parentId: NodeId; newName: string } }
  | { type: FOLDER.UPDATE; payload: { parentId: NodeId; nodeId: NodeId; newName: string } }
  | { type: FOLDER.DELETE; payload: { parentId: NodeId; nodeId: NodeId } }
  | { type: FILE.CREATE; payload: { parentId: NodeId; newName: string } }
  | { type: FILE.UPDATE; payload: { parentId: NodeId; nodeId: NodeId; newName: string } }
  | { type: FILE.DELETE; payload: { parentId: NodeId; nodeId: NodeId } }
  | { type: 'UPDATE_VALUE'; payload: { nodeId: NodeId; value: string | undefined } };

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'SET_DATA':
      return { tree: action.payload };
    case FILE.CREATE:
      if (state.tree) {
        const clone: EditorFolderRecord = cloneDeep(state.tree);
        const parent = findNode(clone, action.payload.parentId);
        if (parent && 'children' in parent) {
          if (Object.values(parent.children).some((i) => i.name === action.payload.newName)) {
            return { ...state, error: 'File already exist' };
          }
          const id = nanoid();
          const path = [...parent.path, 'children'];
          parent.children[id] = {
            id,
            name: action.payload.newName,
            type: EditorTypes.file,
            value: '',
            lang: getLangFromName(action.payload.newName),
            parentId: parent.id,
            path: [...path, id],
          };
          return { ...state, tree: clone };
        }
      }
      return state;
    case FOLDER.CREATE:
      if (state.tree) {
        const clone: EditorFolderRecord = cloneDeep(state.tree);
        const parent = findNode(clone, action.payload.parentId);
        if (parent && 'children' in parent) {
          if (Object.values(parent.children).some((i) => i.name === action.payload.newName)) {
            return { ...state, error: 'Folder already exist' };
          }
          const id = nanoid();
          const path = [...parent.path, 'children'];
          parent.children[id] = {
            id,
            name: action.payload.newName,
            type: EditorTypes.folder,
            children: {},
            parentId: parent.id,
            path: [...path, id],
          };
          return { ...state, tree: clone };
        }
      }
      return state;
    case FILE.UPDATE:
    case FOLDER.UPDATE:
      if (state.tree) {
        const clone: EditorFolderRecord = cloneDeep(state.tree);
        const parent = findNode(clone, action.payload.parentId);
        if (parent && 'children' in parent) {
          const duplicate = Object.values(parent.children).find((i) => i.name === action.payload.newName);
          if (duplicate) {
            return {
              ...state,
              error: `${duplicate.type === EditorTypes.file ? 'File' : 'Folder'} with same name already exist`,
            };
          }
          parent.children[action.payload.nodeId].name = action.payload.newName;
          return { ...state, tree: clone };
        }
      }
      return state;
    case FILE.DELETE:
    case FOLDER.DELETE:
      if (state.tree) {
        const clone: EditorFolderRecord = cloneDeep(state.tree);
        const parent = findNode(clone, action.payload.parentId);
        if (parent && 'children' in parent) {
          delete parent.children[action.payload.nodeId];
          return { ...state, tree: clone };
        }
      }
      return state;
    case 'UPDATE_VALUE':
      if (state.tree) {
        const clone: EditorFolderRecord = cloneDeep(state.tree);
        const found = findNode(clone, action.payload.nodeId);
        if (found) {
          found.value = action.payload.value;
          return { ...state, tree: clone };
        }
      }
      return state;
    default:
      return state;
  }
};
