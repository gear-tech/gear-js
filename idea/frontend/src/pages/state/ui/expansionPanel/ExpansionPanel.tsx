/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx';
import { useState } from 'react';

import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';

import { Functions } from '../functions';
import styles from './ExpansionPanel.module.scss';

type Props = {
  id: string;
  heading: string;
  list: string[];
  value: string;
  onChange: (funcId: string, funcName: string) => void;
};

const ExpansionPanel = ({ id, heading, list, value, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prevValue) => !prevValue);

  const headerClassName = clsx(styles.header, isOpen && styles.open);

  return (
    <div>
      <header className={headerClassName} onClick={toggle}>
        <h4 className={styles.heading}>{heading}</h4>
        <ArrowSVG className={styles.arrow} />
      </header>
      {isOpen && <Functions list={list} value={value} stateId={id} onChange={onChange} />}
    </div>
  );
};

export { ExpansionPanel };
