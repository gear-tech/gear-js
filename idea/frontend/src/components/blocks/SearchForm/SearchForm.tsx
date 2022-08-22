import { ChangeEvent, FormEvent, useState } from 'react';
import clsx from 'clsx';
import { Button, Input, buttonStyles } from '@gear-js/ui';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

import styles from './SearchForm.module.scss';

import { URL_PARAMS } from 'consts';
import searchIcon from 'assets/images/search.svg';

type Props = {
  placeholder: string;
};

const SearchForm = ({ placeholder }: Props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get(URL_PARAMS.QUERY) ?? '');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    navigate({ search: searchParams.toString() });
  };

  const handleReset = () => {
    setSearchValue('');
    searchParams.delete(URL_PARAMS.QUERY);
    setSearchParams(searchParams);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;

    setSearchValue(currentValue);
    searchParams.set(URL_PARAMS.PAGE, String(1));
    searchParams.set(URL_PARAMS.QUERY, currentValue.trim());
  };

  const linkClasses = clsx(buttonStyles.button, buttonStyles.secondary, buttonStyles.small);

  return (
    <form className={styles.searchForm} onReset={handleReset} onSubmit={handleSubmit}>
      <Input icon={searchIcon} value={searchValue} placeholder={placeholder} onChange={handleChange} />
      <Link to={{ search: searchParams.toString() }} className={linkClasses}>
        <img className={buttonStyles.icon} src={searchIcon} alt="search icon" />
        Search
      </Link>
      <Button type="reset" text="Reset search" color="transparent" className={styles.resetButton} />
    </form>
  );
};

export { SearchForm };
