import { useState } from 'react';
import { EditorTypes } from 'types/editor';
import { File, FilePlus, Folder, FolderPlus } from 'react-feather';

import './EditorTree.scss';
import { EditorRecursiveTree } from './EditorRecursiveTree';
import { FILE, FOLDER } from './state/consts';
import { EditorTreeInput } from './EditorTreeInput';
import { useEditorTreeContext } from './state/EditorTreeContext';

export const EditorTree = () => {
  const { state, dispatch } = useEditorTreeContext();

  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showAddFile, setShowAddFile] = useState(false);

  const handleFolderSubmit = (name: string) => {
    if (state.tree) {
      dispatch({ type: FOLDER.CREATE, payload: { parentId: 'root', newName: name } });
      setShowAddFolder(false);
    }
  };
  const handleFileSubmit = (name: string) => {
    if (state.tree) {
      dispatch({ type: FILE.CREATE, payload: { parentId: 'root', newName: name } });
      setShowAddFile(false);
    }
  };

  const handleCancel = () => {
    setShowAddFolder(false);
    setShowAddFile(false);
  };

  return (
    <div className="editor-tree">
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
    </div>
  );
};
