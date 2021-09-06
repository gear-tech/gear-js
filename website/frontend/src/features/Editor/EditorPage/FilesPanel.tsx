import React, { createRef } from 'react';
import clsx from 'clsx';

import { EditorFile } from 'types/editor';

import TSIcon from 'icons/typescript.svg';
import TOMLIcon from 'icons/toml.svg';
import JSIcon from 'icons/js.svg';
import RUSTIcon from 'icons/rust.svg';
import JSONIcon from 'icons/json.svg';
import CloseIcon from 'images/close.svg';

type Props = {
  files: EditorFile[];
  openedFiles: number[];
  currentFile: number;
  handleFileClose: (index: number) => void;
  handleFileSelect: (index: number) => void;
};

const FilesPanel = ({ files, openedFiles, handleFileClose, handleFileSelect, currentFile }: Props) => {
  function pickUpFileIcon(fileExt?: string) {
    switch (fileExt) {
      case 'ts':
        return TSIcon;
      case 'js':
        return JSIcon;
      case 'toml':
        return TOMLIcon;
      case 'rs':
        return RUSTIcon;
      case 'json':
        return JSONIcon;
      default:
        return '';
    }
  }

  return (
    <div className="files-panel">
      {files &&
        files.length &&
        files.map((curFile: EditorFile, index: number) => {
          if (openedFiles.includes(index)) {
            const fileIcon = pickUpFileIcon(curFile.name.split('.').pop());
            const fileRef = createRef<HTMLButtonElement>();
            return (
              <button
                className={clsx('files-panel--item', currentFile === index && 'is-active')}
                type="button"
                onClick={(event: React.MouseEvent) => {
                  if (fileRef && !fileRef.current?.contains(event.target as Node)) {
                    handleFileSelect(index);
                  }
                }}
              >
                {fileIcon && <img src={fileIcon} alt="file-ext" className="files-panel--item__icon" />}
                {curFile.name}
                <button
                  className="files-panel--item__close"
                  type="button"
                  onClick={(event: React.MouseEvent) => {
                    if (fileRef && fileRef.current?.contains(event.target as Node)) {
                      handleFileClose(index);
                    }
                  }}
                  ref={fileRef}
                >
                  <img src={CloseIcon} alt="close-icon" />
                </button>
              </button>
            );
          }
          return null;
        })}
    </div>
  );
};

export { FilesPanel };
