import React, { useRef } from 'react';
import clsx from 'clsx';
import { useAlert } from 'react-alert';
import { Field } from 'formik';
import { Trash2 } from 'react-feather';
import { Button } from '@gear-js/ui';

import styles from './MetaFile.module.scss';

import { checkFileFormat } from 'helpers';

type Props = {
  file: File | null;
  className?: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
};

const MetaFile = (props: Props) => {
  const alert = useAlert();
  const metaFieldRef = useRef<HTMLInputElement>(null);

  const { file, className, onUpload, onDelete } = props;

  const uploadMetaFile = () => {
    metaFieldRef.current?.click();
  };

  const handleChangeMetaFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const isCorrectFormat = checkFileFormat(event.target.files[0]);

      if (isCorrectFormat) {
        onUpload(event.target.files[0]);
      } else {
        alert.error('Wrong file format');
      }

      event.target.value = '';
    }
  };

  return (
    <div className={clsx(styles.upload, className)}>
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
        {file ? (
          <div className={clsx(styles.value, styles.filename)}>
            {file.name}
            <button type="button" onClick={onDelete}>
              <Trash2 color="#ffffff" size="20" strokeWidth="1" />
            </button>
          </div>
        ) : (
          <Button
            text="Select file"
            type="button"
            color="secondary"
            className={styles.button}
            onClick={uploadMetaFile}
          />
        )}
      </div>
    </div>
  );
};

export { MetaFile };
