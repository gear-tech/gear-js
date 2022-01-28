import React, { FC } from 'react';
import clsx from 'clsx';
import codeIcon from 'assets/images/code_icon.svg';
import timestampIcon from 'assets/images/timestamp_icon.svg';
import menuIcon from 'assets/images/menu_icon.svg';
import styles from './ProgramsLegend.module.scss';

export const ProgramsLegend: FC = () => (
  <div className={clsx(styles.legend)}>
    <div className={styles.legendItem}>
      <img className={styles.legendIcon} src={codeIcon} alt="program name" />
      <p className={styles.legendCaption}>Program name</p>
    </div>
    <div className={styles.legendItem}>
      <img className={styles.legendIcon} src={timestampIcon} alt="timestamp" />
      <p>Timestamp</p>
    </div>
    <div className={styles.legendItem}>
      <img className={styles.legendIcon} src={menuIcon} alt="actions" />
      <p>Send message / Upload metadata</p>
    </div>
  </div>
);
