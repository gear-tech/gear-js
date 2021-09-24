import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NativeTypes } from 'react-dnd-html5-backend';
import { DropTargetMonitor, useDrop } from 'react-dnd';

import { GEAR_MNEMONIC_KEY } from 'consts';
import { generateKeypairAction, programUploadResetAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';
import { SocketService } from 'services/SocketService';
import { StatusPanel } from 'components/blocks/StatusPanel/StatusPanel';
import { ProgramDetails } from '../ProgramDetails/ProgramDetails';

import './UploadProgramForm.scss';

type Props = {
  socketService: SocketService;
};

export const UploadProgramForm: VFC<Props> = ({ socketService }) => {
  const dispatch = useDispatch();

  const { programUploadingError } = useSelector((state: RootState) => state.programs);

  useEffect(() => {
    if (!localStorage.getItem(GEAR_MNEMONIC_KEY)) {
      dispatch(generateKeypairAction());
    }
  }, [dispatch]);

  // const [droppedFile, setDroppedFile] = useState<File[]>([]);
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
        }
      }
    },
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
      }
    }
  };

  return (
    <>
      {(droppedFile && (
        <ProgramDetails setDroppedFile={setDroppedFile} droppedFile={droppedFile} socketService={socketService} />
      )) || (
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
      {(wrongFormat || programUploadingError) && (
        <StatusPanel
          onClose={() => {
            setWrongFormat(false);
            if (programUploadingError) {
              dispatch(programUploadResetAction());
            }
          }}
          statusPanelText={programUploadingError}
          isError
        />
      )}
    </>
  );
};
