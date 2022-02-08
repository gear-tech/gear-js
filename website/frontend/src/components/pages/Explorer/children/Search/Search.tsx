import React, { useState, ChangeEvent, FormEvent } from 'react';
import { isHex } from '@polkadot/util';
import { useHistory } from 'react-router-dom';
import { DIGITS_REGEX } from 'regexes';
import styles from './Search.module.scss';

const Search = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const isNumeric = DIGITS_REGEX.test(searchQuery);
  const isValid = isHex(searchQuery, 256) || isNumeric;

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const path = `/explorer/${searchQuery}`;
    history.push(path);
    setSearchQuery('');
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
      <button type="submit" className={styles.button} disabled={!isValid}>
        Search
      </button>
    </form>
  );
};

export { Search };
