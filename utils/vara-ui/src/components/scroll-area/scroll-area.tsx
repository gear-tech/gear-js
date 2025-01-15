import cx from 'clsx';
import { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react';

import styles from './scroll-area.module.scss';

type Props<T extends ElementType> = PropsWithChildren &
  ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
  };

function ScrollArea<T extends ElementType = 'div'>({ as, children, className, ...attrs }: Props<T>) {
  const Element = as || 'div';

  return (
    <Element className={cx(styles.container, className)} {...attrs}>
      {children}
    </Element>
  );
}

export { ScrollArea };
export type { Props as ScrollAreaProps };
