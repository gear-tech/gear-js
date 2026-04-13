import { clsx } from 'clsx';
import { type KeyboardEvent, type ReactNode, useState } from 'react';

import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';

import styles from './expansion-panel.module.scss';

type Props = {
  heading: string;
  subheading: string;
  children: ReactNode;
};

const ExpansionPanel = ({ children, heading, subheading }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prevValue) => !prevValue);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  };

  const arrowClassName = clsx(styles.arrow, isOpen && styles.open);

  return (
    <div className={styles.panel}>
      {/* biome-ignore lint/a11y/useSemanticElements: div acts as a clickable toggle */}
      <header className={styles.header} onClick={toggle} role="button" tabIndex={0} onKeyDown={handleKeyDown}>
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
