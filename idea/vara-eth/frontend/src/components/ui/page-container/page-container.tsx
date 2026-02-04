import { PropsWithChildren } from 'react';

import { PropsWithClassName } from '@/shared/types';
import { cx } from '@/shared/utils';

import styles from './page-container.module.scss';

const PageContainer = ({ children, className }: PropsWithChildren & PropsWithClassName) => {
  return <div className={cx(styles.container, className)}>{children}</div>;
};

export { PageContainer };
