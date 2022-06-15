import { useEffect, useState, ReactNode } from 'react';
import clsx from 'clsx';
import { Edit, FilePlus, Folder, FolderPlus, Trash } from 'react-feather';
import { EditorFolder, EditorTypes } from '../../../types/editor';
import { useEditorTreeContext } from './state/EditorTreeContext';
import { FILE, FOLDER } from './state/consts';
import { EditorTreeInput } from './EditorTreeInput';

interface ItemProps {
  item: EditorFolder;
  children: ReactNode;
}

export const EditorTreeFolderItem = ({ item, children }: ItemProps) => {
  const { dispatch, setCurrentFile } = useEditorTreeContext();
  const [isEditing, setEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [childrenCopy, setChildrenCopy] = useState<ReactNode[]>([]);

  useEffect(() => {
    setChildrenCopy([children]);
  }, [children]);

  const commitAddFile = (name: string) => {
    if (dispatch) {
      dispatch({ type: FILE.CREATE, payload: { parentId: item.id, newName: name } });
      setCurrentFile(null);
    }
  };
  const commitUpdateFolderName = (name: string) => {
    if (dispatch) {
      dispatch({ type: FOLDER.UPDATE, payload: { parentId: item.parentId, nodeId: item.id, newName: name } });
      setEditing(false);
    }
  };
  const commitAddFolder = (name: string) => {
    if (dispatch) {
      dispatch({ type: FOLDER.CREATE, payload: { parentId: item.id, newName: name } });
    }
  };
  const handleDelete = () => {
    // TODO: change to modal lib
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?') && dispatch) {
      dispatch({ type: FOLDER.DELETE, payload: { parentId: item.parentId, nodeId: item.id } });
      setCurrentFile(null);
    }
  };

  function handleClick() {
    setIsOpen(!isOpen);
  }

  function handleEdit(event: React.SyntheticEvent) {
    event.stopPropagation();
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setChildrenCopy([children]);
  }

  function handleAddFile(event: React.SyntheticEvent) {
    event.stopPropagation();
    setIsOpen(true);
    /* eslint-disable react/jsx-no-bind */
    setChildrenCopy([
      ...childrenCopy,
      <EditorTreeInput
        type={EditorTypes.file}
        onSubmit={commitAddFile}
        onCancel={handleCancel}
        key={`editor-file-input-${item.id}`}
      />,
    ]);
  }

  function handleAddFolder(event: React.SyntheticEvent) {
    event.stopPropagation();
    setIsOpen(true);
    /* eslint-disable react/jsx-no-bind */
    setChildrenCopy([
      ...childrenCopy,
      <EditorTreeInput
        key={`editor-folder-input-${item.id}`}
        type={EditorTypes.folder}
        onSubmit={commitAddFolder}
        onCancel={handleCancel}
      />,
    ]);
  }

  /* eslint-disable react/jsx-no-bind */
  return (
    <div className={clsx('editor-tree__folder', isOpen && 'is-open')}>
      <div role="button" tabIndex={0} aria-hidden="true" className="editor-tree__item is-folder" onClick={handleClick}>
        <div className="editor-tree__line">
          <Folder size={12} />
          &nbsp;
          {isEditing ? (
            <EditorTreeInput
              type={EditorTypes.folder}
              onSubmit={commitUpdateFolderName}
              onCancel={handleCancel}
              value={item.name}
            />
          ) : (
            <span>{item.name}</span>
          )}
        </div>
        <div className="tree-actions">
          &nbsp;
          <button className="tree-actions__btn" onClick={handleAddFolder} type="button">
            <FolderPlus size={12} color="#fff" />
          </button>
          &nbsp;
          <button className="tree-actions__btn" onClick={handleAddFile} type="button">
            <FilePlus size={12} color="#fff" />
          </button>
          &nbsp;
          <button className="tree-actions__btn" onClick={handleEdit} type="button">
            <Edit size={12} color="#fff" />
          </button>
          &nbsp;
          <button className="tree-actions__btn" onClick={handleDelete} type="button">
            <Trash size={12} color="#fff" />
          </button>
        </div>
      </div>
      <div className="editor-tree__folder-items">{childrenCopy}</div>
    </div>
  );
};
