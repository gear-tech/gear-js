import React, { useState } from 'react';
import clsx from 'clsx';
import { EditorFile } from '../../../types/editor';

interface Props {
  files: EditorFile[];
  selectFile: (name: string) => void;
}

export const Tree = ({ files, selectFile }: Props) => {
  const [selected, setSelected] = useState(0);
  const items = files.map((item, index) => (
    <div
      className={clsx('editor-tree__item', index === selected && 'is-active')}
      onClick={() => {
        selectFile(item.name);
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
