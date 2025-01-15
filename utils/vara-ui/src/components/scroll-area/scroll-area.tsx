import cx from 'clsx';
import { PropsWithChildren } from 'react';

import styles from './scroll-area.module.scss';

type Props = PropsWithChildren & {
  className?: string;
};

function ScrollArea({ children, className }: Props) {
  return <div className={cx(styles.container, className)}>{children}</div>;
}

export { ScrollArea };
export type { Props as ScrollAreaProps };
