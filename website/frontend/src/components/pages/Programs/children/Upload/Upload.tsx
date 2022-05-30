import { useState, useEffect } from 'react';

import styles from './Upload.module.scss';
import { DroppedFile, UploadTypes } from './types';
import { DropTarget } from './children/DropTarget/DropTarget';
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
      {isProgramUpload ? (
        <UploadForm setDroppedFile={setDroppedFile} droppedFile={droppedFile.file} />
      ) : (
        <div className={styles.upload}>
          <DropTarget type={UploadTypes.PROGRAM} setDroppedFile={setDroppedFile} />
          <DropTarget type={UploadTypes.CODE} setDroppedFile={setDroppedFile} />
        </div>
      )}
    </>
  );
};
