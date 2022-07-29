import { useCallback, useRef } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import clsx from 'clsx';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './DropTarget.module.scss';
import pageStyles from '../../Main.module.scss';
import { ContentType } from '../../types';

import { FILE_TYPES } from 'consts';
import { checkFileFormat } from 'helpers';
import uploadSVG from 'assets/images/upload.svg';
import editorSVG from 'assets/images/editor_icon.svg';

type Props = {
  type: ContentType;
  onUpload: (type: ContentType, file: File) => void;
};

const DropTarget = ({ type, onUpload }: Props) => {
  const alert = useAlert();

  const inputRef = useRef<HTMLInputElement>(null);

  const emulateInputClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (checkFileFormat(file)) {
      onUpload(type, file);
      // since type='file' input can't be controlled,
      // reset it's value to trigger onChange again in case the same file selected twice
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    } else {
      alert.error('Wrong file format');
    }
  };

  const handleFileDrop = useCallback(
    (item: { files: File[] }) => {
      const file = item.files?.[0];

      if (!file) {
        return;
      }

      if (checkFileFormat(file)) {
        onUpload(type, file);
      } else {
        alert.error('Wrong file format');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkFileFormat, onUpload, type]
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop: handleFileDrop,
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [handleFileDrop]
  );

  const buttonText = `Upload ${type}`;

  const isActive = canDrop && isOver;
  const isProgramUpload = type === ContentType.Program;

  const dropClasses = clsx(pageStyles.action, styles.drop, isActive && styles.active);

  return (
    <div ref={drop} className={dropClasses}>
      {isActive ? (
        <div className={styles.file}>
          <p className={pageStyles.actionDescription}>Drop your .wasm files here to upload</p>
        </div>
      ) : (
        <div className={pageStyles.actionContent}>
          <input ref={inputRef} type="file" accept={FILE_TYPES.WASM} className={styles.input} onChange={handleChange} />
          <Button
            text={buttonText}
            icon={isProgramUpload ? uploadSVG : editorSVG}
            color={isProgramUpload ? 'primary' : 'secondary'}
            onClick={emulateInputClick}
          />
          <p
            className={pageStyles.actionDescription}
          >{`Click “${buttonText}” to browse or drag and drop your .wasm files here`}</p>
        </div>
      )}
    </div>
  );
};

export { DropTarget };
