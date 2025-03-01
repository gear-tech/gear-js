import { useState } from 'react';

import SearchSVG from '@/assets/icons/search.svg?react';
import { Button } from '@/components';

import styles from './search.module.scss';

const Search = () => {
  const [search, setSearch] = useState('');

  const onSearch = () => {
    console.log('Search for:', search);
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Search by block number, code id, program id, wallet address..."
      />
      <Button variant="icon" onClick={onSearch}>
        <SearchSVG />
      </Button>
    </div>
  );
};

export { Search };
