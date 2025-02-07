import { clsx } from 'clsx';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { Button } from '@/components';
import ArrowDownSVG from '@/assets/icons/arrow-square-down.svg?react';
import styles from './expandable-item.module.scss';

type Props = PropsWithChildren & {
  header: ReactNode;
  headerSlot?: ReactNode;
  isNested?: boolean;
};

const ExpandableItem = ({ children, header, headerSlot, isNested }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>();

  return (
    <div className={clsx(styles.container, isNested && styles.nested)}>
      <div className={clsx(styles.header, isNested && styles.nested)}>
        <div className={styles.leftSide}>
          <Button variant="icon" onClick={() => setIsOpen((prev) => !prev)}>
            <ArrowDownSVG className={clsx(isOpen && styles.iconOpen)} />
          </Button>
          {header}
        </div>
        {headerSlot}
      </div>
      {isOpen && <div className={clsx(styles.content, isNested && styles.nested)}>{children}</div>}
    </div>
  );
};

export { ExpandableItem };
