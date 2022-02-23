import React, { useState } from 'react';
import upload from 'assets/images/upload.svg';
import editor from 'assets/images/editor_icon.svg';
import { Colors } from 'common/components/Button/types';
import { UploadForm } from './UploadForm/UploadForm';
import { DropTarget } from './DropTarget/DropTarget';
import styles from './Upload.module.scss';

export const Upload = () => {
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  return droppedFile ? (
    <UploadForm setDroppedFile={setDroppedFile} droppedFile={droppedFile} />
  ) : (
    <div className={styles.upload}>
      <DropTarget text="Upload program" icon={upload} setDroppedFile={setDroppedFile} />
      <DropTarget text="Upload code" icon={editor} color={Colors.MAIN} setDroppedFile={setDroppedFile} />
    </div>
  );
};
