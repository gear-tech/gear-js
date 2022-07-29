import { Link } from 'react-router-dom';
import { routes } from 'routes';

import styles from './Logo.module.scss';

import { ReactComponent as LogoSVG } from 'assets/images/logo.svg';

const Logo = () => (
  <Link to={routes.main} className={styles.imgWrapper}>
    <LogoSVG data-testid="svg" />
  </Link>
);

export { Logo };
