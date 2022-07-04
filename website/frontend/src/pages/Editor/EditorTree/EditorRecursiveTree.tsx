import { EditorItemRecord, EditorTypes } from '../../../types/editor';
import { EditorTreeFileItem } from './EditorTreeFileItem';
import { EditorTreeFolderItem } from './EditorTreeFolderItem';

type Props = {
  files: EditorItemRecord;
};

export const EditorRecursiveTree = ({ files }: Props) => (
  <>
    {Object.entries(files).map(([, value]) => (
      <div key={`editor-tree-item-${value.id}`}>
        {value.type === EditorTypes.file ? (
          <EditorTreeFileItem isActive={false} item={value} />
        ) : (
          <EditorTreeFolderItem item={value}>
            {value.children && <EditorRecursiveTree files={value.children} />}
          </EditorTreeFolderItem>
        )}
      </div>
    ))}
  </>
);
