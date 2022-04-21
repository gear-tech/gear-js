import React, { ChangeEvent, useState } from 'react';
import { Button, Input, buttonStyles } from '@gear-js/ui';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import searchIcon from 'assets/images/search.svg';
import { URL_PARAMS } from 'consts';
import styles from './SearchForm.module.scss';
import clsx from 'clsx';

type Props = {
  placeholder: string;
};

const SearchForm = ({ placeholder }: Props) => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.secondary, buttonStyles.normal);
  const { pathname: url } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState('');

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setValue(target.value);
  };

  const getUrl = () => {
    searchParams.set(URL_PARAMS.PAGE, String(1));
    searchParams.set(URL_PARAMS.QUERY, value);

    return `${url}?${searchParams.toString()}`;
  };

  const resetSearch = () => {
    setValue('');
    searchParams.delete(URL_PARAMS.QUERY);
    setSearchParams(searchParams);
  };

  return (
    <form>
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
        <div className={styles.links}>
          <Link className={linkClasses} to={getUrl()}>
            <img className={buttonStyles.icon} src={searchIcon} alt="search icon" />
            <p>Search</p>
          </Link>
          <Button
            className={styles.resetButton}
            text="Reset search"
            type="reset"
            color="transparent"
            onClick={resetSearch}
          />
        </div>
      </div>
    </form>
  );
};

export { SearchForm };
