import React, { FC, useRef, useState, useEffect, useCallback } from 'react';
import styles from './MetaField.module.scss';

type Props = {
  label: string;
  value: any;
  type: any;
};

export const MetaField: FC<Props> = ({ label, value, type }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  const showAlert = () => {
    setIsVisible(!isVisible);
  };

  const handleOutsideClick = useCallback(({ target }: MouseEvent) => {
    const isElementClicked = ref.current?.contains(target as Node);

    if (!isElementClicked) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}:</span>
      <div ref={ref} className={styles.type} onClick={showAlert}>
        <span className={styles.typeText}>{value}</span>
        {isVisible && <pre className={styles.typeAlert}>{JSON.stringify(type, null, 4)}</pre>}
      </div>
    </div>
  );
};
