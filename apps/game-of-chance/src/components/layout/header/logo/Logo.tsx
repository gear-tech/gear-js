import { Link } from 'react-router-dom';
import { ReactComponent as SVG } from 'assets/images/logo.svg';
import styles from './Logo.module.scss';

function Logo() {
  return (
    <Link to="/" className={styles.logo}>
      <SVG />
    </Link>
  );
}

export { Logo };
