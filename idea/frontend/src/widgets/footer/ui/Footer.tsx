import { useMemo } from 'react';
import { useApp } from 'hooks';

import { DotButton } from './dotButton/DotButton';
import { Socials } from './socials/Socials';
import styles from './Footer.module.scss';

const Footer = () => {
  const { nodeAddress } = useApp();

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className={styles.footer}>
      <Socials />
      <small className={styles.copyright}>&copy; {year} Gear Technologies, Inc. All Rights Reserved.</small>
      <DotButton nodeAddress={nodeAddress} />
    </footer>
  );
};

export { Footer };
