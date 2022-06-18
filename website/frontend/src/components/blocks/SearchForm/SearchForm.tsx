import { ChangeEvent, useState } from 'react';
import clsx from 'clsx';
import { Button, Input, buttonStyles } from '@gear-js/ui';
import { Link, useSearchParams } from 'react-router-dom';

import styles from './SearchForm.module.scss';
import { URL_PARAMS } from 'consts';
import searchIcon from 'assets/images/search.svg';

type Props = {
  placeholder: string;
};

const SearchForm = ({ placeholder }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get(URL_PARAMS.QUERY) ?? '');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;

    setSearchValue(currentValue);
    searchParams.set(URL_PARAMS.PAGE, String(1));
    searchParams.set(URL_PARAMS.QUERY, currentValue);
  };

  const resetSearch = () => {
    setSearchValue('');
    searchParams.delete(URL_PARAMS.QUERY);
    setSearchParams(searchParams);
  };

  const linkClasses = clsx(buttonStyles.button, buttonStyles.secondary, buttonStyles.small);

  return (
    <div>
      <div className={styles.searchForm}>
        <Input
          icon={searchIcon}
          value={searchValue}
          className={styles.inputWrapper}
          placeholder={placeholder}
          onChange={handleChange}
        />
        <Link to={{ search: searchParams.toString() }} className={linkClasses}>
          <img className={buttonStyles.icon} src={searchIcon} alt="search icon" />
          Search
        </Link>
        <Button text="Reset search" color="transparent" className={styles.resetButton} onClick={resetSearch} />
      </div>
    </div>
  );
};

export { SearchForm };
