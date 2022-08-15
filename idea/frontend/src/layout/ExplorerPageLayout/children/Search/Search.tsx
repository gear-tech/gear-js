import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { isHex } from 'helpers';
import { DIGITS_REGEX } from 'regexes';
import styles from './Search.module.scss';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isNumeric = DIGITS_REGEX.test(searchQuery);
  const isValid = isHex(searchQuery) || isNumeric;

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const path = `/explorer/${searchQuery}`;

    navigate(path);
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
