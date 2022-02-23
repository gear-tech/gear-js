import React from 'react';
import styles from './Link.module.scss';

type Props = {
  name: string;
  href: string;
};

const Link = ({ name, href }: Props) => (
  <li className={styles.link}>
    <a href={href} target="_blank" rel="noreferrer" className={styles[name]} />
  </li>
);

export { Link };
