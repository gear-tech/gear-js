import React, { FC, useState } from 'react';
import { useOutsideClick } from 'hooks';
import { getPreformattedText } from 'helpers';
import styles from './MetaField.module.scss';

type Props = {
  label: string;
  value: any;
  type: any;
};

export const MetaField: FC<Props> = ({ label, value, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleAlert = () => {
    setIsVisible((prevValue) => !prevValue);
  };

  const hideAlert = () => {
    setIsVisible(false);
  };

  const ref = useOutsideClick(hideAlert);

  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}:</span>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div ref={ref} className={styles.type} onClick={toggleAlert}>
        <span className={styles.typeText}>{value}</span>
        {isVisible && <pre className={styles.typeAlert}>{getPreformattedText(type)}</pre>}
      </div>
    </div>
  );
};
