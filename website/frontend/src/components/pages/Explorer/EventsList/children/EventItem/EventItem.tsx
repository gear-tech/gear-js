import React, { useState } from 'react';
import { Event } from '@polkadot/types/interfaces';
import clsx from 'clsx';
import { Header } from './children/Header/Header';
import { Body } from './children/Body/Body';
import styles from './EventItem.module.scss';

type Props = {
  event: Event;
};

const EventItem = ({ event }: Props) => {
  const { section, method, meta, data } = event;
  const { docs } = meta;

  const [isOpen, setIsOpen] = useState(false);

  const className = clsx('programs-list__item', styles.item);
  const caption = `${section}.${method}`;
  const description = String(docs.toHuman());

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

export { EventItem };
