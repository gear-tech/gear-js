import { useLocation, useNavigate } from 'react-router-dom';
import { Hex } from 'viem';

import { Button, LinkButton } from '@/components';
import { routes } from '@/shared/config';

import styles from './not-found.module.scss';

export const NotFound = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const searchQuery = location.state as Hex | null;

  return (
    <div className={styles.container}>
      <div>
        <span className={styles.prefix}>{'//_'}</span>
        <span className={styles.title}>Nothing found</span>
      </div>

      {searchQuery && (
        <div className={styles.text}>
          <p>We couldn&apos;t find a match for your search request.</p>
          <p>Try a different query or check Etherscan instead.</p>
        </div>
      )}

      <div className={styles.buttons}>
        <Button variant="outline" className={styles.button} onClick={() => navigate(routes.home)}>
          Try again
        </Button>

        {searchQuery && (
          <LinkButton
            variant="outline"
            className={styles.button}
            href={`https://hoodi.etherscan.io/search?f=0&q=${searchQuery}`}>
            Search on Etherscan
          </LinkButton>
        )}
      </div>
    </div>
  );
};
