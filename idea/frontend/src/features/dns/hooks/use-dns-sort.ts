import { useState } from 'react';
import { SortDirection } from '../types';

const DEFAULT_SORT_VALUES = {
  orderByField: 'updatedAt',
  orderByDirection: 'DESC' as SortDirection,
};

function useDnsSort() {
  const [values, setValues] = useState(DEFAULT_SORT_VALUES);

  const toggleDirection = () => {
    setValues(({ orderByField, orderByDirection }) => ({
      orderByField,
      orderByDirection: orderByDirection === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return [values, toggleDirection, setValues] as const;
}

export { useDnsSort };
