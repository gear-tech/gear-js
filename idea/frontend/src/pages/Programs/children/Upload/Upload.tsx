import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styles from './Upload.module.scss';
import { DroppedFile, UploadTypes } from './types';
import { BlockList } from '../BlocksList/BlocksList';
import { DropTarget } from './children/DropTarget/DropTarget';
import { SendMessage } from './children/SendMessage';
import { UploadForm } from './children/UploadForm/UploadForm';

import { useCodeUpload } from 'hooks';

export const Upload = () => {
  const [droppedFile, setDroppedFile] = useState<DroppedFile | null>(null);

  const uploadCode = useCodeUpload();

  const isProgramUpload = droppedFile?.type === UploadTypes.PROGRAM;

  useEffect(() => {
    if (droppedFile?.type === UploadTypes.CODE) {
      uploadCode(droppedFile.file);
      setDroppedFile(null);
    }
  }, [droppedFile, uploadCode]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {isProgramUpload ? (
          <UploadForm setDroppedFile={setDroppedFile} droppedFile={droppedFile.file} />
        ) : (
          <div className={styles.upload}>
            <DropTarget type={UploadTypes.PROGRAM} setDroppedFile={setDroppedFile} />
            <SendMessage />
            <DropTarget type={UploadTypes.CODE} setDroppedFile={setDroppedFile} />
          </div>
        )}
      </DndProvider>
      <BlockList />
    </>
  );
};
