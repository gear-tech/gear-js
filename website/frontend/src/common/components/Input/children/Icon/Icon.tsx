import React from 'react';
import styles from './Icon.module.scss';

type Props = {
  src: string;
};

const Icon = ({ src }: Props) => <img src={src} alt="input icon" className={styles.icon} />;

export { Icon };
