import React, { FC } from 'react';
import styles from './Button.module.scss';

type Props = {
  handleResetForm: () => void;
};

export const Buttons: FC<Props> = ({ handleResetForm }) => {
  return (
    <div className={styles.buttons}>
      <button type="submit" className={styles.upload} aria-label="uploadProgramm">
        Upload program
      </button>
      <button type="button" className={styles.cancel} aria-label="closeUploadForm" onClick={handleResetForm}>
        Cancel upload
      </button>
    </div>
  );
};
