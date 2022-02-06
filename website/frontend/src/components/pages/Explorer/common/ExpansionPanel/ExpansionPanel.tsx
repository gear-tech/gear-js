import React, { ReactNode, useState } from 'react';
import clsx from 'clsx';
import { Header } from './Header/Header';
import styles from './ExpansionPanel.module.scss';

type Props = {
  caption: string;
  description: string;
  blockNumber?: string;
  counter?: number;
  children: ReactNode;
};

const ExpansionPanel = ({ caption, description, blockNumber, counter, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const className = clsx('programs-list__item', styles.item);

  const toggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  return (
    <li className={className}>
      <Header
        caption={caption}
        description={description}
        blockNumber={blockNumber}
        counter={counter}
        isOpen={isOpen}
        onClick={toggle}
      />
      {isOpen && <div className={styles.body}>{children}</div>}
    </li>
  );
};

export { ExpansionPanel };
