import React, { useState } from 'react';
import { Event } from '@polkadot/types/interfaces';
import clsx from 'clsx';
import { Header } from './children/Header/Header';
import { Body } from './children/Body/Body';
import { getCaption } from '../../helpers';
import styles from './EventItem.module.scss';

type Props = {
  list: Event[];
};

const EventItem = ({ list }: Props) => {
  const [event] = list;
  const { method, meta } = event;
  const { docs } = meta;

  const [isOpen, setIsOpen] = useState(false);

  const className = clsx('programs-list__item', styles.item);
  // can be EventGroup properties
  const caption = getCaption(event);
  const description = String(docs.toHuman());

  const toggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  return (
    <li className={className}>
      <Header
        caption={caption}
        description={description}
        isOpen={isOpen}
        onClick={toggle}
        groupEventsAmount={list.length}
      />
      {isOpen && <Body method={method} list={list} />}
    </li>
  );
};

export { EventItem };
