import { PropsWithChildren } from 'react';

import styles from './media-query.module.scss';

function Desktop({ children }: PropsWithChildren) {
  return <div className={styles.desktop}>{children}</div>;
}

function Mobile({ children }: PropsWithChildren) {
  return <div className={styles.mobile}>{children}</div>;
}

function ShowBelowXl({ children }: PropsWithChildren) {
  return <div className={styles.showBelowXl}>{children}</div>;
}

function ShowFromXl({ children }: PropsWithChildren) {
  return <div className={styles.showFromXl}>{children}</div>;
}

const MediaQuery = { Desktop, Mobile, ShowBelowXl, ShowFromXl };

export { MediaQuery };
