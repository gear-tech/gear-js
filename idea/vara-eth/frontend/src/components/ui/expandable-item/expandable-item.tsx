import { clsx } from 'clsx';
import { type PropsWithChildren, type ReactNode, useState } from 'react';

import ArrowDownSVG from '@/assets/icons/arrow-square-down.svg?react';
import { Button } from '@/components';

import styles from './expandable-item.module.scss';

type Props = PropsWithChildren & {
  header: ReactNode;
  headerSlot?: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  className?: string;
};

const ExpandableItem = ({
  children,
  header,
  headerSlot,
  isOpen,
  defaultOpen,
  className,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultOpen ?? isOpen ?? false);

  const isEmptyChildren =
    children === undefined ||
    children === null ||
    (typeof children === 'object' && 'length' in children && children.length === 0);

  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.leftSide}>
          {isEmptyChildren ? (
            <div className={clsx(styles.empty, styles.icon)} />
          ) : (
            <Button variant="icon" onClick={() => setIsExpanded((prev) => !prev)}>
              <ArrowDownSVG className={clsx(styles.icon, isExpanded && styles.iconOpen)} />
            </Button>
          )}
          {header}
        </div>
        {headerSlot}
      </div>
      {isExpanded && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export { ExpandableItem };
