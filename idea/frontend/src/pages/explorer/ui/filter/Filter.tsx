import { Button, Checkbox } from '@gear-js/ui';
import { Dispatch, SetStateAction, ChangeEvent } from 'react';

import { FilterValues, FILTER_VALUES, LOCAL_STORAGE } from '../../model';

import styles from './Filter.module.scss';

type Props = {
  values: FilterValues;
  setValues: Dispatch<SetStateAction<FilterValues>>;
  isAnySelected: boolean;
};

// TODO: there's Filters component in /features
const Filter = ({ values, setValues, isAnySelected }: Props) => {
  const filters = Object.keys(values);

  const handleChange = ({ target: { name, checked } }: ChangeEvent<HTMLInputElement>) => {
    setValues((prevValues) => {
      const newValues = { ...prevValues, [name]: checked };
      const stringifiedNewValues = JSON.stringify(newValues);

      localStorage.setItem(LOCAL_STORAGE.EVENT_FILTERS, stringifiedNewValues);
      return newValues;
    });
  };

  const getFilters = () =>
    filters.map((filter) => (
      <li key={filter}>
        <Checkbox
          label={filter}
          name={filter}
          className={styles.checkbox}
          checked={values[filter]}
          onChange={handleChange}
        />
      </li>
    ));

  const reset = () => {
    setValues(FILTER_VALUES);
    localStorage.removeItem(LOCAL_STORAGE.EVENT_FILTERS);
  };

  return (
    <div className={styles.filter}>
      <header>
        <h3 className={styles.heading}>Filters</h3>
        {isAnySelected && (
          <Button text="Clear all" color="transparent" className={styles.button} size="small" onClick={reset} />
        )}
      </header>
      <ul className={styles.body}>{getFilters()}</ul>
    </div>
  );
};

export { Filter };
