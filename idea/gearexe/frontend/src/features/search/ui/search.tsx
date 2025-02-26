import { isAddress } from 'ethers';
import { useState } from 'react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';

import SearchSVG from '@/assets/icons/search.svg?react';
import { Button } from '@/components';
import { routes } from '@/shared/config';

import styles from './search.module.scss';

const Search = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === routes.home;

  const onSearch = () => {
    if (!search) {
      return;
    }

    if (isAddress(search)) {
      navigate(generatePath(routes.user, { userId: search }));
      return;
    }

    navigate(generatePath(routes.notFound));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Search by block number, code id, program id, wallet address..."
        onKeyDown={onKeyDown}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={isHomePage}
      />
      <Button variant="icon" onClick={onSearch}>
        <SearchSVG />
      </Button>
    </div>
  );
};

export { Search };
