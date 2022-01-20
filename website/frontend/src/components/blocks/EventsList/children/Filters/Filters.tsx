import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Sliders } from 'react-feather';
import { Checkbox } from 'common/components/Checkbox/Checkbox';
import { FilterValues } from 'types/events-list';
import styles from './Filters.module.scss';
import { LOCAL_STORAGE } from 'consts';

type Props = {
  values: FilterValues;
  setValues: Dispatch<SetStateAction<FilterValues>>;
};

const Filters = ({ values, setValues }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  return (
    <div className={styles.filters}>
      <button type="button" className={styles.button} onClick={toggle}>
        <Sliders size={16} strokeWidth={3} />
      </button>
      {isOpen && <ul className={styles.list}>{getFilters()}</ul>}
    </div>
  );
};

export { Filters };
