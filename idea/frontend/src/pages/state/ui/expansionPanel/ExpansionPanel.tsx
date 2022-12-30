/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Radio } from '@gear-js/ui';
import clsx from 'clsx';
import { useState } from 'react';

import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';

import styles from './ExpansionPanel.module.scss';

type Props = {
  heading: string;
  list: string[];
};

const ExpansionPanel = ({ heading, list }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prevValue) => !prevValue);

  const headerClassName = clsx(styles.header, isOpen && styles.open);

  const getRadioButtons = () =>
    list.map((func) => (
      <li key={func}>
        <Radio label={func} name="functions" />
      </li>
    ));

  return (
    <div>
      <header className={headerClassName} onClick={toggle}>
        <h4 className={styles.heading}>{heading}</h4>
        <ArrowSVG className={styles.arrow} />
      </header>
      {isOpen && <ul className={styles.list}>{getRadioButtons()}</ul>}
    </div>
  );
};

export { ExpansionPanel };
