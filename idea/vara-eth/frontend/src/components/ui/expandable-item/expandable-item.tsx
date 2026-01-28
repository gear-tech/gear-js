import { clsx } from 'clsx';
import { PropsWithChildren, ReactNode, useState } from 'react';

import ArrowDownSVG from '@/assets/icons/arrow-square-down.svg?react';
import { Button } from '@/components';

import styles from './expandable-item.module.scss';

type Props = PropsWithChildren & {
  header: ReactNode;
  headerSlot?: ReactNode;
  isOpen?: boolean;
};

const ExpandableItem = ({ children, header, headerSlot, isOpen: isDefaultOpen = false }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(isDefaultOpen);

  const isEmptyChildren =
    children === undefined ||
    children === null ||
    (typeof children === 'object' && 'length' in children && children.length === 0);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.leftSide}>
          {isEmptyChildren ? (
            <div className={clsx(styles.empty, styles.icon)} />
          ) : (
            <Button variant="icon" onClick={() => setIsOpen((prev) => !prev)}>
              <ArrowDownSVG className={clsx(styles.icon, isOpen && styles.iconOpen)} />
            </Button>
          )}
          {header}
        </div>
        {headerSlot}
      </div>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export { ExpandableItem };
