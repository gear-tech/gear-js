import React, { useState } from 'react';
import clsx from 'clsx';
import { Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { Header } from './children/Header/Header';
import { Body } from './children/Body/Body';
import styles from './Extrinsic.module.scss';

type Props = {
  extrinsic: DotExtrinsic;
};

const Extrinsic = ({ extrinsic }: Props) => {
  const { method, section, meta, args } = extrinsic.method;
  const { docs } = meta;
  const [isOpen, setIsOpen] = useState(false);

  const className = clsx('programs-list__item', styles.item);
  const caption = `${section}.${method}`;
  const description = docs[0].toHuman();

  const toggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  return (
    <li className={className}>
      <Header caption={caption} description={description} isOpen={isOpen} onClick={toggle} />
      {isOpen && <Body args={args} metaArgs={meta.args} />}
    </li>
  );
};

export { Extrinsic };
