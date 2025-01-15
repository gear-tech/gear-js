import { PropsWithChildren } from 'react';

import styles from './scroll-area.module.scss';

type Props = PropsWithChildren;

function ScrollArea({ children }: Props) {
  return <div className={styles.scrollArea}>{children}</div>;
}

export { ScrollArea };
export type { Props as ScrollAreaProps };
