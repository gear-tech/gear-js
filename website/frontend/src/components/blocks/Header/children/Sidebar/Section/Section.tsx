import React, { ReactNode } from 'react';
import styles from './Section.module.scss';

type Props = {
  caption: string;
  children: ReactNode;
};

const Section = ({ caption, children }: Props) => {
  return (
    <li key={caption} className="nodes__item">
      <p className="nodes__item-caption">{caption}</p>
      <ul className="nodes__item-list">{children}</ul>
    </li>
  );
};

export { Section };
