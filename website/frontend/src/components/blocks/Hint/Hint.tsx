import React, { FC, useRef, useEffect, useState } from 'react';
import { HelpCircle } from 'react-feather';
import styles from './Hint.module.scss';

type Params = {
  children: string;
};

export const Hint: FC<Params> = ({ children }) => {
  const timerId = useRef<any>(null);
  const [isShow, setIsShow] = useState<Boolean>(false);

  useEffect(() => {
    if (isShow) {
      timerId.current = setTimeout(() => {
        setIsShow(false);
      }, 3000);
    }
  }, [isShow]);

  const handleClick = () => {
    if (isShow) {
      clearInterval(timerId.current);
    }

    setIsShow(!isShow);
  };

  return (
    <div className={styles.hint}>
      <HelpCircle className={styles.icon} size="16" onClick={handleClick} />
      {isShow && <p className={styles.text}>{children}</p>}
    </div>
  );
};
