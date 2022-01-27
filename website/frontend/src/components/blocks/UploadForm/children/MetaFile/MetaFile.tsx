import React, { FC, useRef } from 'react';
import { Field } from 'formik';
import clsx from 'clsx';
import { Trash2 } from 'react-feather';
import styles from './MetaFile.module.scss';

type Props = {
  droppedMetaFile: File | null;
  handleRemoveMetaFile: () => void;
  handleChangeMetaFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const MetaFile: FC<Props> = ({ droppedMetaFile, handleRemoveMetaFile, handleChangeMetaFile }) => {
  const metaFieldRef = useRef<HTMLDivElement | null>(null);

  const uploadMetaFile = () => {
    metaFieldRef.current?.click();
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
            <button type="button" onClick={handleRemoveMetaFile}>
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
