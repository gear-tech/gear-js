/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx';
import { ReactNode, useState } from 'react';

import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';

import styles from './expansion-panel.module.scss';

type Props = {
  heading: string;
  subheading: string;
  children: ReactNode;
};

const ExpansionPanel = ({ children, heading, subheading }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prevValue) => !prevValue);

  const arrowClassName = clsx(styles.arrow, isOpen && styles.open);

  return (
    <div className={styles.panel}>
      <header className={styles.header} onClick={toggle}>
        <header className={styles.innerHeader}>
          <h3 className={styles.heading}>{heading}</h3>
          <ArrowSVG className={arrowClassName} />
        </header>
        <p>{subheading}</p>
      </header>

      {isOpen && children}
    </div>
  );
};

export { ExpansionPanel };
