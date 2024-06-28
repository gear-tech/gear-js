import { useState, ChangeEvent } from 'react';

import { Ctors, Functions, Services } from '../../types';

type Props = {
  label?: string;
  onChange?: (value: string) => void;
};

function useSelect(functions: Ctors | Services | Functions, props?: Props) {
  const names = Object.keys(functions);
  const options = names.map((name) => ({ label: name, value: name }));
  const label = props?.label;

  const [value, setValue] = useState(names[0]);

  const onChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    setValue(target.value);
    props?.onChange?.(target.value);
  };

  return { options, value, label, onChange };
}

export { useSelect };
