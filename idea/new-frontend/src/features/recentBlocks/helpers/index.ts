import { CSSProperties } from 'react';

const getRandomPercent = () => Math.ceil((Math.random() || 0.01) * 100);

const getMinWidth = (value?: number): CSSProperties => {
  const length = value ? String(value).length : 5;

  return {
    minWidth: `${((length + 1) * 10.5) / 16}rem`,
  };
};

export { getMinWidth, getRandomPercent };
