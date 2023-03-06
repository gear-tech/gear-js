import { CSSProperties } from 'react';

const getRandomPercent = () => Math.ceil((Math.random() || 0.01) * 100);

const getMinWidth = (value: string): CSSProperties => ({
  minWidth: `${(value.length * 10) / 16}rem`,
});

export { getMinWidth, getRandomPercent };
