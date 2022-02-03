import React, { useState } from 'react';
import clsx from 'clsx';
import { EventGroup } from 'types/explorer';
import { Header } from './children/Header/Header';
import { Body } from './children/Body/Body';
import styles from './Event.module.scss';

type Props = {
  group: EventGroup;
};

const Event = ({ group }: Props) => {
  const { list, method, caption, description } = group;
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
        isOpen={isOpen}
        onClick={toggle}
        groupEventsAmount={list.length}
      />
      {isOpen && <Body method={method} list={list} />}
    </li>
  );
};

export { Event };
