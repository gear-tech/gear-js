import { useState } from 'react';

import styles from './MetaField.module.scss';

import { useOutsideClick } from 'hooks';
import { getPreformattedText } from 'helpers';

type Props = {
  label: string;
  value: string;
  type: any;
};

const MetaField = ({ label, value, type }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleAlert = () => setIsVisible((prevState) => !prevState);

  const fieldRef = useOutsideClick<HTMLDivElement>(() => setIsVisible(false));

  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}:</span>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div ref={fieldRef} className={styles.type} onClick={toggleAlert}>
        <span className={styles.typeText}>{value}</span>
        {isVisible && <pre className={styles.typeAlert}>{getPreformattedText(type)}</pre>}
      </div>
    </div>
  );
};

export { MetaField };
