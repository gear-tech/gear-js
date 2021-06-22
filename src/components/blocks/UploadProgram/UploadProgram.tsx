import React, {useState, useCallback, useEffect, useRef} from 'react';

import { useDispatch } from 'react-redux';

import {NativeTypes} from 'react-dnd-html5-backend';
import {useDrop, DropTargetMonitor} from 'react-dnd';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { emitEvents, GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY } from 'consts';

import { generateKeypairAction } from 'store/actions/actions';

import Error from '../Error';
import ProgramDetails from '../ProgramDetails';

import './UploadProgram.scss';

const UploadProgram = () => {

  const dispatch = useDispatch();

  const socketClientReference = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>()

  useEffect(() => {

    socketClientReference.current = io("http://localhost:3000/api/ws", {
      query: { Authorization: localStorage.getItem(GEAR_STORAGE_KEY) || "" },
    });

    if (!localStorage.getItem(GEAR_MNEMONIC_KEY)) {
      dispatch(generateKeypairAction())
    }
  }, [dispatch]);

  // const [droppedFile, setDroppedFile] = useState<File[]>([]);
  const [wrongFormat, setWrongFormat] = useState(false);

  if ( wrongFormat ) {
    setTimeout( () => setWrongFormat(false), 3000);
  }

  const checkFileFormat = useCallback((files: any) => {
    // eslint-disable-next-line no-console
    if ( typeof files[0]?.name === 'string' ) {
      const fileExt: string = files[0].name.split(".").pop().toLowerCase();
      return fileExt !== 'wasm';
    } 
    return true
  }, [])

  const handleFilesUpload = useCallback((file) => {
    if (socketClientReference.current) {
      socketClientReference.current.emit(emitEvents.uploadProgram, {
        file,
        filename: file.name,
        gasLimit: 2,
        value: 2,
        initPayload: "",
        mnemonic: localStorage.getItem(GEAR_MNEMONIC_KEY) || "",
      });
    }
  }, [])

  const handleFileDrop = useCallback(
    (item) => {
      if (item) {
        const { files } = item;
        const isCorrectFormat = checkFileFormat(files);
        setWrongFormat(isCorrectFormat);
        if (!isCorrectFormat) {
          handleFilesUpload(files[0])
        }
      }
    },
    [checkFileFormat, handleFilesUpload],
  );

  const [{canDrop, isOver}, drop] = useDrop(
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
    [handleFileDrop],
  );

  const isActive = canDrop && isOver;
  const dropBlockClassName = isActive ? "drop-block drop-block--file-over" : "drop-block";

  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    if ( hiddenFileInput !== null && hiddenFileInput.current !== null ) {
      // @ts-ignore
      hiddenFileInput.current.click();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const { files } = target;
    if ( files?.length ) {
      const isCorrectFormat = checkFileFormat(files);
      setWrongFormat(isCorrectFormat);
      if (!isCorrectFormat) {
        handleFilesUpload(files[0])
      }    
    }
  };

  return (
    <>
      <div className={dropBlockClassName} ref={drop}>
        <div className="drop-block__no-file-hover">
          <input className="drop-block__input-file" ref={hiddenFileInput} type="file" onChange={handleChange}/>
          <button className="drop-block__button" type="button" onClick={handleClick}>Upload program</button>
          <div className="drop-block__info">
            Click “Upload program” to browse or
            drag and drop your .TBD files here
          </div>
        </div>
        <div className="drop-block__file-hover">
          <span className="drop-block__hover-info">Drop your .TBD files here to upload</span>
        </div>
      </div>
      {wrongFormat && <Error onClose={() => setWrongFormat(false)}/>}
      <ProgramDetails/>
    </>
  );
};

export default UploadProgram;