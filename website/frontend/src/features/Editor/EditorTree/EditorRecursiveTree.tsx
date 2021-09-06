import React from 'react';
import { EditorItemRecord, EditorTypes } from '../../../types/editor';
import { EditorTreeFileItem } from './EditorTreeFileItem';
import { EditorTreeFolderItem } from './EditorTreeFolderItem';

type Props = {
  files: EditorItemRecord;
};

export const EditorRecursiveTree = ({ files }: Props) => (
  <>
    {Object.entries(files).map(([, value]) => {
      if (value.type === EditorTypes.file) {
        return <EditorTreeFileItem isActive={false} item={value} key={`editor-tree-item-${value.id}`} />;
      }
      return (
        <>
          {value.type === EditorTypes.folder && (
            <EditorTreeFolderItem item={value} key={`editor-tree-item-${value.id}`}>
              {value.children && <EditorRecursiveTree files={value.children} key={`editor-rtree-${value.id}`} />}
            </EditorTreeFolderItem>
          )}
        </>
      );
    })}
  </>
);
