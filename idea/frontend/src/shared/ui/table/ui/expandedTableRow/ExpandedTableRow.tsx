import { useState, ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import { useElementSizes } from 'hooks';
import { AnimationTimeout } from 'shared/config';
import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';

import styles from '../Table.module.scss';

type Props = {
  name: string;
  value: string;
  children?: ReactNode;
};

const ExpandedTableRow = ({ name, value, children }: Props) => {
  const { elementRef, elementStyles } = useElementSizes<HTMLDivElement>();

  const [isOpen, setIsopen] = useState(false);

  const toggleView = () => setIsopen((prevState) => !prevState);

  return (
    <CSSTransition in={isOpen} timeout={AnimationTimeout.Default}>
      <div style={elementStyles} className={styles.expandedTableRow}>
        <button type="button" className={clsx(buttonStyles.transparent, styles.expandedBtn)} onClick={toggleView}>
          <div className={styles.tableRow}>
            <span className={styles.name}>{name}</span>
            <span className={styles.value}>{value}</span>
            <span className={clsx(styles.expandedIcon, isOpen && styles.rotated)}>
              <ArrowSVG />
            </span>
          </div>
        </button>
        <CSSTransition in={isOpen} timeout={AnimationTimeout.Default}>
          <div ref={elementRef} className={styles.content}>
            {children}
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  );
};

export { ExpandedTableRow };
