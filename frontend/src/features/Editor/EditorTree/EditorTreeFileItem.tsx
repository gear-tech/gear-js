import React, { useState } from 'react';
import { Edit, File, Trash } from 'react-feather';
import clsx from 'clsx';

import { EditorItem, EditorTypes } from '../../../types/editor';
import { useEditorTreeContext } from './state/EditorTreeContext';
import { FILE } from './state/consts';
import { EditorTreeInput } from './EditorTreeInput';

interface ItemProps {
  item: EditorItem;
  isActive: boolean;
}

export const EditorTreeFileItem = ({ item, isActive }: ItemProps) => {
  const { dispatch, onNodeClick } = useEditorTreeContext();
  const [isEditing, setEditing] = useState(false);

  function handleEdit() {
    setEditing(true);
  }

  function handleDelete() {
    // TODO: change to modal lib
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?') && dispatch) {
      dispatch({ type: FILE.DELETE, payload: { parentId: item.parentId, nodeId: item.id } });
    }
  }

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSubmit = (name: string) => {
    if (dispatch) {
      dispatch({ type: FILE.UPDATE, payload: { parentId: item.parentId, nodeId: item.id, newName: name } });
      setEditing(false);
    }
  };

  const handleNodeClick = React.useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      onNodeClick(item);
    },
    [item, onNodeClick]
  );

  return (
    <div
      className={clsx('editor-tree__item', isActive && 'is-active')}
      onClick={handleNodeClick}
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      <div className="editor-tree__line">
        <File size={12} />
        &nbsp;
        {isEditing ? (
          <EditorTreeInput onCancel={handleCancel} onSubmit={handleSubmit} value={item.name} type={EditorTypes.file} />
        ) : (
          <>{`${item.name}`}</>
        )}
      </div>
      <div className="tree-actions">
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
  );
};
