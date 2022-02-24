import React, { useState } from 'react';
import { UploadForm } from './UploadForm/UploadForm';
import { DropTarget } from './DropTarget/DropTarget';
import { CodeModal } from './CodeModal/CodeModal';
import { DroppedFile, UploadTypes } from './types';
import styles from './Upload.module.scss';

export const Upload = () => {
  const [droppedFile, setDroppedFile] = useState<DroppedFile | null>(null);
  const isProgramUpload = droppedFile?.type === UploadTypes.PROGRAM;
  const isCodeUpload = droppedFile?.type === UploadTypes.CODE;

  return (
    <>
      {isProgramUpload ? (
        <UploadForm setDroppedFile={setDroppedFile} droppedFile={droppedFile.file} />
      ) : (
        <div className={styles.upload}>
          <DropTarget type={UploadTypes.PROGRAM} setDroppedFile={setDroppedFile} />
          <DropTarget type={UploadTypes.CODE} setDroppedFile={setDroppedFile} />
        </div>
      )}
      {isCodeUpload && <CodeModal file={droppedFile.file} setDroppedFile={setDroppedFile} />}
    </>
  );
};
