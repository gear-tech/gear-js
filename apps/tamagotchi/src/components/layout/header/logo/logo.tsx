import { Link } from 'react-router-dom';
import styles from './logo.module.scss';
import { Icon } from 'components/ui/icon';

export const Logo = () => {
  return (
    <Link to="/" className={styles.link}>
      <Icon name="logo" width={180} height={44} />
    </Link>
  );
};
