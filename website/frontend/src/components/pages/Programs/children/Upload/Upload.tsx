import React, { useState } from 'react';
import { UploadForm } from 'components/blocks/UploadForm/UploadForm';
import { DropTarget } from './DropTarget/DropTarget';
import styles from './Upload.module.scss';

export const Upload = () => {
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  return droppedFile ? (
    <UploadForm setDroppedFile={setDroppedFile} droppedFile={droppedFile} />
  ) : (
    <div className={styles.upload}>
      <DropTarget setDroppedFile={setDroppedFile} />
      <DropTarget setDroppedFile={setDroppedFile} />
    </div>
  );
};
