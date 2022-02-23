import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import clsx from 'clsx';
import { NativeTypes } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import upload from 'assets/images/upload.svg';
import { Button } from 'common/components/Button/Button';
import { RootState } from 'store/reducers';
import { AddAlert, programUploadResetAction } from 'store/actions/actions';
import { EventTypes } from 'types/alerts';
import styles from './DropTarget.module.scss';

type Props = {
  setDroppedFile: Dispatch<SetStateAction<File | null>>;
};

const DropTarget = ({ setDroppedFile }: Props) => {
  const dispatch = useDispatch();

  const { programUploadingError } = useSelector((state: RootState) => state.programs);

  const [wrongFormat, setWrongFormat] = useState(false);

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
    (file) => {
      setDroppedFile(file);
    },
    [setDroppedFile]
  );

  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    if (hiddenFileInput !== null && hiddenFileInput.current !== null) {
      // @ts-ignore
      hiddenFileInput.current.click();
    }
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
      } else {
        dispatch(AddAlert({ type: EventTypes.ERROR, message: 'Wrong file format' }));
        setWrongFormat(false);
        if (programUploadingError) {
          dispatch(programUploadResetAction());
        }
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
          dispatch(AddAlert({ type: EventTypes.ERROR, message: 'Wrong file format' }));
          setWrongFormat(false);
          if (programUploadingError) {
            dispatch(programUploadResetAction());
          }
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

  return (
    <div className={className} ref={drop}>
      <div className={styles.noFile}>
        <input className={styles.input} ref={hiddenFileInput} type="file" onChange={handleChange} />
        <Button text="Upload program" icon={upload} onClick={handleClick} />
        <div className={styles.text}>Click “Upload program” to browse or drag and drop your .wasm files here</div>
      </div>
      <div className={styles.file}>
        <span className={styles.text}>Drop your .wasm files here to upload</span>
      </div>
    </div>
  );
};

export { DropTarget };
