import React from 'react';
import {useState, useCallback} from 'react';
import {NativeTypes} from 'react-dnd-html5-backend';
import {useDrop, DropTargetMonitor} from 'react-dnd';
import Error from '../Error';

import ProgramDetails from '../ProgramDetails';

import './UploadProgram.scss';

const UploadProgram = () => {
  const [droppedFile, setDroppedFile] = useState<File[]>([]);
  const [wrongFormat, setWrongFormat] = useState(false);

  if ( wrongFormat ) {
    setTimeout( () => setWrongFormat(false), 3000);
  }

  const handleFileDrop = useCallback(
    (item) => {
      if (item) {
        const files = item.files;
        setDroppedFile(files);
        if ( typeof files[0]?.name === 'string' ) {
          const fileExt: string = files[0].name.split(".").pop().toLowerCase();
          setWrongFormat(fileExt !== 'tbd');
        } else {
          setWrongFormat(true);
        }
      }
    },
    [setDroppedFile],
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

  console.log(droppedFile[0]?.name);

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
    const files = target.files;
    if ( files?.length ) {
      //setDroppedFile(files);
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