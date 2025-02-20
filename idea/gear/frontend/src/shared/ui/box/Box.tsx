import clsx from 'clsx';
import { ReactNode } from 'react';

import styles from './Box.module.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

const Box = ({ children, className }: Props) => <div className={clsx(styles.box, className)}>{children}</div>;

export { Box };
