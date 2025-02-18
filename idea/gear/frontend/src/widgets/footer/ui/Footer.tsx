import { useApi } from '@gear-js/react-hooks';
import cx from 'clsx';
import { useMemo } from 'react';

import DotSVG from '@/shared/assets/images/logos/dotLogo.svg?react';

import styles from './Footer.module.scss';
import { Socials } from './socials/Socials';

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
