import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import './Main.scss';

type Props = {
  color?: string;
  children: React.ReactNode;
};

export const Main: FC<Props> = ({ children, color = '#232323' }) => {
  const colorStyle = { background: color } as React.CSSProperties;

  return (
    <main className="main" style={colorStyle}>
      {children}
    </main>
  );
};
