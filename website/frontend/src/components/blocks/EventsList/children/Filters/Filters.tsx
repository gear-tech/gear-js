import React, { useState } from 'react';
import { Sliders } from 'react-feather';
import { Checkbox } from 'common/components/Checkbox/Checkbox';
import * as init from './init';
import styles from './Filters.module.scss';

const Filters = () => {
  const [isOpen, setIsOpen] = useState(false);

  const getFilters = () =>
    init.filters.map((filter) => (
      <li key={filter}>
        <Checkbox label={filter} className={styles.checkbox} />
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
