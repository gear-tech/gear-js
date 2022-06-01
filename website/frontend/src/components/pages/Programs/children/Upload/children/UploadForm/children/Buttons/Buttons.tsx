import React, { FC } from 'react';
import styles from './Buttons.module.scss';
import { Button } from '@gear-js/ui';

type Props = {
  handleResetForm: () => void;
  handleCalculateGas: () => void;
  isUploadAvailable: boolean;
};

export const Buttons: FC<Props> = ({ handleResetForm, handleCalculateGas, isUploadAvailable }) => {
  return (
    <div className={styles.buttons}>
      <Button
        type="submit"
        className={styles.upload}
        aria-label="uploadProgramm"
        text="Upload program"
        disabled={isUploadAvailable}
      />
      <Button className={styles.upload} type="button" onClick={handleCalculateGas} text="Calculate Gas" />
      <Button
        type="button"
        color="transparent"
        aria-label="closeUploadForm"
        onClick={handleResetForm}
        text="Cancel upload"
      />
    </div>
  );
};
