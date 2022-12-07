import { Icon } from 'components/ui/icon';
import { Link } from 'react-router-dom';
import styles from './logo.module.scss';

export const Logo = () => {
  return (
    <Link to="/" className={styles.link}>
      <Icon name="logo" width={180} height={44} />
    </Link>
  );
};
