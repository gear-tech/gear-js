import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import clsx from 'clsx';
import { Sliders, X } from 'react-feather';
import { Checkbox } from '@gear-js/ui';
import { FilterValues } from 'types/explorer';
import { LOCAL_STORAGE } from 'consts';
import { useOutsideClick } from 'hooks';
import * as init from '../init';
import styles from './Filters.module.scss';

type Props = {
  values: FilterValues;
  setValues: Dispatch<SetStateAction<FilterValues>>;
  isAnySelected: boolean;
};

const Filters = ({ values, setValues, isAnySelected }: Props) => {
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

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  const reset = () => {
    setValues(init.filterValues);
    localStorage.removeItem(LOCAL_STORAGE.EVENT_FILTERS);
    close();
  };

  const ref = useOutsideClick<HTMLDivElement>(close);
  const toggleButtonClassName = clsx(styles.button, styles.toggleButton);
  const resetButtonClassName = clsx(styles.button, styles.resetButton);

  return (
    <div className={styles.filters} ref={ref}>
      <button type="button" className={toggleButtonClassName} onClick={toggle}>
        <Sliders size={16} strokeWidth={3} />
      </button>
      {isOpen && (
        <div className={styles.body}>
          <ul className={styles.list}>{getFilters()}</ul>
          {isAnySelected && (
            <footer className={styles.footer}>
              <button type="button" className={resetButtonClassName} onClick={reset}>
                <X size={16} strokeWidth={3} className={styles.icon} />
                Clear filters
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
};

export { Filters };
