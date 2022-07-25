import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { EditorFile } from 'types/editor';

interface Props {
  files: EditorFile[];
  selectFile: (index: number) => void;
  currentFile: number;
}

export const Tree = ({ files, selectFile, currentFile }: Props) => {
  const [selected, setSelected] = useState(currentFile);

  useEffect(() => {
    if (selected !== currentFile) {
      setSelected(currentFile);
    }
  }, [selected, setSelected, currentFile]);

  const items = files.map((item, index) => (
    <div
      className={clsx('editor-tree__item', index === selected && 'is-active')}
      onClick={() => {
        selectFile(index);
        setSelected(index);
      }}
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      {`${item.name}`}
    </div>
  ));
  return <div className="editor-tree">{items}</div>;
};
