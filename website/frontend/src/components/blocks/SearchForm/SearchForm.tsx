import React, { ChangeEvent, useState, FormEvent } from 'react';
import { Button, Input, buttonStyles } from '@gear-js/ui';
import { Link, useSearchParams } from 'react-router-dom';
import searchIcon from 'assets/images/search.svg';
import { URL_PARAMS } from 'consts';
import styles from './SearchForm.module.scss';
import clsx from 'clsx';

type Props = {
  placeholder: string;
};

const SearchForm = ({ placeholder }: Props) => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.secondary, buttonStyles.small);
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState('');

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setValue(target.value);
  };

  const setUrlParams = () => {
    searchParams.set(URL_PARAMS.PAGE, String(1));
    searchParams.set(URL_PARAMS.QUERY, value);
  };

  const getTo = () => {
    setUrlParams();

    return { search: searchParams.toString() };
  };

  const resetSearch = () => {
    setValue('');
    searchParams.delete(URL_PARAMS.QUERY);
    setSearchParams(searchParams);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    setUrlParams();
    setSearchParams(searchParams);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.searchForm}>
        <Input
          icon={searchIcon}
          className={styles.inputWrapper}
          type="text"
          placeholder={placeholder}
          name={URL_PARAMS.QUERY}
          value={value}
          onChange={handleChange}
        />
        <Link className={linkClasses} to={getTo()}>
          <img className={buttonStyles.icon} src={searchIcon} alt="search icon" />
          Search
        </Link>
        <Button
          className={styles.resetButton}
          text="Reset search"
          type="reset"
          color="transparent"
          onClick={resetSearch}
        />
      </div>
    </form>
  );
};

export { SearchForm };
