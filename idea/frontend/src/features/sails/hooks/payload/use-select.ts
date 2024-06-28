import { useState, ChangeEvent } from 'react';

import { Ctors, Functions, Services } from '../../types';

function useSelect(functions: Ctors | Services | Functions, onChange?: (value: string) => void) {
  const names = Object.keys(functions);
  const options = names.map((name) => ({ label: name, value: name }));

  const [value, setValue] = useState(names[0]);

  const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    setValue(target.value);
    onChange?.(target.value);
  };

  return { options, value, setValue, handleChange };
}

export { useSelect };
