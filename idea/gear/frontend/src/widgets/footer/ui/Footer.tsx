import { useMemo } from 'react';
import cx from 'clsx';
import { useApi } from '@gear-js/react-hooks';

import DotSVG from '@/shared/assets/images/logos/dotLogo.svg?react';

import { Socials } from './socials/Socials';
import styles from './Footer.module.scss';

const Footer = () => {
  const { api, isApiReady } = useApi();

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className={styles.footer}>
      <Socials />

      <small className={styles.copyright}>&copy; {year} Gear Technologies, Inc. All Rights Reserved.</small>

      <a
        href={`https://polkadot.js.org/apps/?rpc=${api?.provider.endpoint}#/explorer`}
        target="_blank"
        rel="noreferrer"
        className={cx(styles.dotButton, !isApiReady && styles.disabled)}>
        <DotSVG className={styles.icon} />
        <span>Polkadot Explorer</span>
      </a>
    </footer>
  );
};

export { Footer };
