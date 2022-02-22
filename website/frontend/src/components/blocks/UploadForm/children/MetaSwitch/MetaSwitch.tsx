import React, { FC } from 'react';
import deselected from 'assets/images/radio-deselected.svg';
import selected from 'assets/images/radio-selected.svg';
import styles from './MetaSwitch.module.scss';

type Props = {
  isMetaFromFile: boolean;
  setIsMetaFromFile: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MetaSwitch: FC<Props> = ({ isMetaFromFile, setIsMetaFromFile }) => {
  return (
    <div className={styles.switch}>
      <span className={styles.caption}>Metadata: </span>
      <div className={styles.block}>
        <button type="button" className={styles.button} onClick={() => setIsMetaFromFile(true)}>
          <img className={styles.img} src={isMetaFromFile ? selected : deselected} alt="radio" />
          Upload file
        </button>
        <button type="button" className={styles.button} onClick={() => setIsMetaFromFile(false)}>
          <img className={styles.img} src={isMetaFromFile ? deselected : selected} alt="radio" />
          Manual input
        </button>
      </div>
    </div>
  );
};
