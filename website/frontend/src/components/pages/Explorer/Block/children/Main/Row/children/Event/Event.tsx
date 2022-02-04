import React, { useState } from 'react';
import clsx from 'clsx';
import { Event as DotEvent } from '@polkadot/types/interfaces';
import { Header } from './children/Header/Header';
import { Body } from './children/Body/Body';
import styles from './Event.module.scss';

type Props = {
  event: DotEvent;
};

const Event = ({ event }: Props) => {
  const { method, section, meta, data } = event;
  const { docs } = meta;
  const [isOpen, setIsOpen] = useState(false);

  const className = clsx('programs-list__item', styles.item);
  const caption = `${section}.${method}`;
  const description = docs.toHuman();

  const toggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  return (
    <li className={className}>
      <Header caption={caption} description={description} isOpen={isOpen} onClick={toggle} />
      {isOpen && <Body method={method} data={data} />}
    </li>
  );
};

export { Event };
