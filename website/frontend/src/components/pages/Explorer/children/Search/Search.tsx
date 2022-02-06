import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Search.module.scss';

const Search = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedSearchQuery = searchQuery.trim();

    if (trimmedSearchQuery) {
      const href = `/explorer/${trimmedSearchQuery}`;
      history.push(href);
      setSearchQuery('');
    }
  };

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search block hash or number to query"
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
};

export { Search };
