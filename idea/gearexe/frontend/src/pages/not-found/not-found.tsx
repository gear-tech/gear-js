import { useNavigate } from 'react-router-dom';

import { Button, Navigation } from '@/components';
import { Search } from '@/features/search';
import { routes } from '@/shared/config';

import styles from './not-found.module.scss';

export const NotFound = () => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(routes.home);
  };

  return (
    <>
      <Navigation search={<Search />} />
      <div className={styles.container}>
        <div>
          <span className={styles.prefix}>{'//_'}</span>
          <span className={styles.text}>Nothing found</span>
        </div>
        <Button variant="outline" className={styles.button} onClick={onClick}>
          Try again
        </Button>
      </div>
    </>
  );
};
