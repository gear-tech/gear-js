import { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styles from './Upload.module.scss';
import { ContentType } from './types';
import { BlockList } from '../BlocksList/BlocksList';
import { DropTarget } from './children/DropTarget/DropTarget';
import { MessageSide } from './children/MessageSide';
import { SendMessageForm } from './children/SendMessageForm';
import { UploadForm } from './children/UploadForm/UploadForm';

import { useCodeUpload } from 'hooks';

const Upload = () => {
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);

  const uploadCode = useCodeUpload();

  const setMessageType = () => setContentType(ContentType.Message);

  const setUplaodData = useCallback((type: ContentType | null, file: File | null) => {
    setDroppedFile(file);
    setContentType(type);
  }, []);

  const resetUploadData = useCallback(() => setUplaodData(null, null), [setUplaodData]);

  const getContent = () => {
    switch (contentType) {
      case ContentType.Message:
        return <SendMessageForm onReset={resetUploadData} />;
      case ContentType.Program:
        return <UploadForm droppedFile={droppedFile!} onReset={resetUploadData} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (contentType === ContentType.Code && droppedFile) {
      uploadCode(droppedFile);
      resetUploadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType]);

  return (
    <>
      {contentType && contentType !== ContentType.Code ? (
        getContent()
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className={styles.upload}>
            <DropTarget type={ContentType.Program} onUpload={setUplaodData} />
            <MessageSide onClick={setMessageType} />
            <DropTarget type={ContentType.Code} onUpload={setUplaodData} />
          </div>
        </DndProvider>
      )}
      <BlockList />
    </>
  );
};

export { Upload };
