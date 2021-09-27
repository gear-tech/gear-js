import React, { useEffect, useReducer, useState } from 'react';
import { EditorTypes, EditorItem, EditorFolderRecord } from 'types/editor';
import { File, FilePlus, Folder, FolderPlus } from 'react-feather';
import { EditorTreeContext, reducer } from './state';

import './EditorTree.scss';
import { EditorRecursiveTree } from './EditorRecursiveTree';
import { FILE, FOLDER } from './state/consts';
import { EditorTreeInput } from './EditorTreeInput';

interface Props {
  onNodeClick: (node: EditorItem) => void;
  files: EditorFolderRecord;
}

export const EditorTree = ({ files, onNodeClick }: Props) => {
  const [state, dispatch] = useReducer(reducer, { tree: null });

  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showAddFile, setShowAddFile] = useState(false);

  const handleFolderSubmit = (name: string) => {
    if (state.tree) {
      dispatch({ type: FOLDER.CREATE, payload: { nodeId: 'root', newName: name } });
      setShowAddFolder(false);
    }
  };
  const handleFileSubmit = (name: string) => {
    if (state.tree) {
      dispatch({ type: FILE.CREATE, payload: { nodeId: 'root', newName: name } });
      setShowAddFile(false);
    }
  };

  const handleCancel = () => {
    setShowAddFolder(false);
    setShowAddFile(false);
  };

  useEffect(() => {
    dispatch({ type: 'SET_DATA', payload: files });
  }, [files]);

  return (
    <div className="editor-tree">
      <EditorTreeContext.Provider
        value={{
          state,
          dispatch,
          onNodeClick,
        }}
      >
        {state.error && <div className="tree-error">{state.error}</div>}
        <div className="tree-actions is-top">
          <button
            className="tree-actions__btn"
            onClick={() => {
              setShowAddFolder(true);
              setShowAddFile(false);
            }}
            type="button"
          >
            <FolderPlus size={12} color="#fff" />
            &nbsp;New folder
          </button>
          &nbsp;
          <button
            className="tree-actions__btn"
            onClick={() => {
              setShowAddFile(true);
              setShowAddFolder(false);
            }}
            type="button"
          >
            <FilePlus size={12} color="#fff" />
            &nbsp;New file
          </button>
        </div>
        {state.tree && <EditorRecursiveTree files={state.tree.root.children} />}
        {showAddFolder && (
          <div className="editor-tree__item">
            <Folder size={12} />
            &nbsp;
            <EditorTreeInput onSubmit={handleFolderSubmit} type={EditorTypes.folder} onCancel={handleCancel} />
          </div>
        )}
        {showAddFile && (
          <div className="editor-tree__item">
            <File size={12} />
            &nbsp;
            <EditorTreeInput onSubmit={handleFileSubmit} type={EditorTypes.file} onCancel={handleCancel} />
          </div>
        )}
      </EditorTreeContext.Provider>
    </div>
  );
};
