import React, { useState } from 'react';
import { Event } from '@polkadot/types/interfaces';
import clsx from 'clsx';
import { Header } from './children/Header/Header';
import { Body } from './children/Body/Body';
import styles from './EventItem.module.scss';

type Props = {
  value: Event;
};

const EventItem = ({ value }: Props) => {
  const { section, method, meta, data } = value;
  const { docs } = meta;

  const [isOpen, setIsOpen] = useState(false);

  const className = clsx('programs-list__item', styles.item);
  const caption = `${section}.${method}`;
  const description = String(docs.toHuman());
  const params = JSON.stringify(data, null, 2);

  const toggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  return (
    <li className={className}>
      <Header caption={caption} description={description} isOpen={isOpen} onClick={toggle} />
      {isOpen && <Body params={params} />}
    </li>
  );
};

export { EventItem };
