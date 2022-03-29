import React, { FC, useRef } from 'react';
import { useAlert } from 'react-alert';
import { Field } from 'formik';
import clsx from 'clsx';
import { Trash2 } from 'react-feather';
import { checkFileFormat } from 'helpers';
import styles from './MetaFile.module.scss';

type Props = {
  droppedMetaFile: File | null;
  handleUploadMetaFile: (file: File) => void;
  resetMetaForm: () => void;
};

export const MetaFile: FC<Props> = ({ droppedMetaFile, handleUploadMetaFile, resetMetaForm }) => {
  const alert = useAlert();
  const metaFieldRef = useRef<HTMLInputElement>(null);

  const uploadMetaFile = () => {
    metaFieldRef.current?.click();
  };

  const handleChangeMetaFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const isCorrectFormat = checkFileFormat(event.target.files[0]);

      if (isCorrectFormat) {
        handleUploadMetaFile(event.target.files[0]);
      } else {
        alert.error('Wrong file format');
      }

      event.target.value = '';
    }
  };

  return (
    <div className={styles.upload}>
      <label htmlFor="meta" className={styles.caption}>
        Metadata file:
      </label>
      <div className={styles.block}>
        <Field
          id="meta"
          name="meta"
          className={styles.hidden}
          type="file"
          innerRef={metaFieldRef}
          onChange={handleChangeMetaFile}
        />
        {droppedMetaFile ? (
          <div className={clsx(styles.value, styles.filename)}>
            {droppedMetaFile.name}
            <button type="button" onClick={resetMetaForm}>
              <Trash2 color="#ffffff" size="20" strokeWidth="1" />
            </button>
          </div>
        ) : (
          <button className={styles.button} type="button" onClick={uploadMetaFile}>
            Select file
          </button>
        )}
      </div>
    </div>
  );
};
