import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NativeTypes } from 'react-dnd-html5-backend';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { EventTypes } from 'types/events';
import { AddAlert, programUploadResetAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';
import './Upload.scss';
import { ProgramDetails } from '../../../../blocks/ProgramDetails/ProgramDetails';

export const Upload = () => {
  const dispatch = useDispatch();

  const { programUploadingError } = useSelector((state: RootState) => state.programs);

  const [wrongFormat, setWrongFormat] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  if (wrongFormat) {
    setTimeout(() => setWrongFormat(false), 3000);
  }

  const checkFileFormat = useCallback((files: any) => {
    // eslint-disable-next-line no-console
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
  const dropBlockClassName = isActive ? 'drop-block drop-block--file-over' : 'drop-block';

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

  return (
    <>
      {(droppedFile && <ProgramDetails setDroppedFile={setDroppedFile} droppedFile={droppedFile} />) || (
        <div className={dropBlockClassName} ref={drop}>
          <div className="drop-block__no-file-hover">
            <input className="drop-block__input-file" ref={hiddenFileInput} type="file" onChange={handleChange} />
            <button className="drop-block__button" type="button" onClick={handleClick}>
              Upload program
            </button>
            <div className="drop-block__info">
              Click “Upload program” to browse or drag and drop your .wasm files here
            </div>
          </div>
          <div className="drop-block__file-hover">
            <span className="drop-block__hover-info">Drop your .wasm files here to upload</span>
          </div>
        </div>
      )}
    </>
  );
};
