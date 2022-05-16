import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { useAlert } from 'hooks';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import clsx from 'clsx';
import { NativeTypes } from 'react-dnd-html5-backend';
import { Button } from '@gear-js/ui';
import upload from 'assets/images/upload.svg';
import editor from 'assets/images/editor_icon.svg';
import { DroppedFile, UploadTypes } from '../../types';
import styles from './DropTarget.module.scss';

type Props = {
  type: UploadTypes;
  setDroppedFile: Dispatch<SetStateAction<DroppedFile | null>>;
};

const DropTarget = ({ type, setDroppedFile }: Props) => {
  const alert = useAlert();

  const [wrongFormat, setWrongFormat] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (wrongFormat) {
    setTimeout(() => setWrongFormat(false), 3000);
  }

  const checkFileFormat = useCallback((files: any) => {
    if (typeof files[0]?.name === 'string') {
      const fileExt: string = files[0].name.split('.').pop().toLowerCase();
      return fileExt !== 'wasm';
    }
    return true;
  }, []);

  const handleFilesUpload = useCallback(
    (file: File) => {
      setDroppedFile({ file, type });
    },
    [setDroppedFile, type]
  );

  const emulateInputClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (files?.length) {
      const isCorrectFormat = checkFileFormat(files);
      setWrongFormat(isCorrectFormat);
      if (!isCorrectFormat) {
        handleFilesUpload(files[0]);
        // since type='file' input can't be controlled,
        // reset it's value to trigger onChange again in case the same file selected twice
        event.target.value = '';
      } else {
        alert.error('Wrong file format');
        setWrongFormat(false);
      }
    }
  };

  const handleFileDrop = useCallback(
    (item) => {
      if (item) {
        const { files } = item;
        const isCorrectFormat = checkFileFormat(files);
        setWrongFormat(isCorrectFormat);
        if (!isCorrectFormat) {
          handleFilesUpload(files[0]);
        } else {
          alert.error('Wrong file format');
          setWrongFormat(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkFileFormat, handleFilesUpload]
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: any[] }) {
        if (handleFileDrop) {
          handleFileDrop(item);
        }
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [handleFileDrop]
  );

  const isActive = canDrop && isOver;
  const className = clsx(styles.drop, isActive && styles.active);
  const isProgramUpload = type === UploadTypes.PROGRAM;
  const buttonText = `Upload ${type}`;

  return (
    <div className={className} ref={drop}>
      {isActive ? (
        <div className={styles.file}>
          <span className={styles.text}>Drop your .wasm files here to upload</span>
        </div>
      ) : (
        <div className={styles.noFile}>
          <input className={styles.input} ref={inputRef} type="file" onChange={handleChange} />
          <Button
            text={buttonText}
            icon={isProgramUpload ? upload : editor}
            color={isProgramUpload ? 'primary' : 'secondary'}
            onClick={emulateInputClick}
          />
          <div className={styles.text}>{`Click “${buttonText}” to browse or drag and drop your .wasm files here`}</div>
        </div>
      )}
    </div>
  );
};

export { DropTarget };
