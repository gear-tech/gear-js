import React, { FC } from 'react';
import styles from './Buttons.module.scss';

type Props = {
  handleResetForm: () => void;
  handleCalculateGas: () => void;
};

export const Buttons: FC<Props> = ({ handleResetForm, handleCalculateGas }) => {
  return (
    <div className={styles.buttons}>
      <button type="submit" className={styles.upload} aria-label="uploadProgramm">
        Upload program
      </button>
      <button className={styles.upload} type="button" onClick={handleCalculateGas}>
        Calculate Gas
      </button>
      <button type="button" className={styles.cancel} aria-label="closeUploadForm" onClick={handleResetForm}>
        Cancel upload
      </button>
    </div>
  );
};
