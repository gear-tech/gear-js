import { useNavigate } from 'react-router-dom';

import { Button } from '@/components';
import { routes } from '@/shared/config';

import styles from './not-found.module.scss';

export const NotFound = () => {
  const navigate = useNavigate();
  const onClick = () => {
    void navigate(routes.home);
  };

  return (
    <div className={styles.container}>
      <div>
        <span className={styles.prefix}>{'//_'}</span>
        <span className={styles.text}>Nothing found</span>
      </div>
      <Button variant="outline" className={styles.button} onClick={onClick}>
        Try again
      </Button>
    </div>
  );
};
