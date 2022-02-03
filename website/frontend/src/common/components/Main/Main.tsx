import React, { FC } from 'react';
import styles from './Main.module.scss';

type Props = {
  color?: string;
  children: React.ReactNode;
};

export const Main: FC<Props> = ({ children, color = '#232323' }) => {
  const colorStyle = { background: color } as React.CSSProperties;

  return (
    <main className={styles.main} style={colorStyle}>
      {children}
    </main>
  );
};
