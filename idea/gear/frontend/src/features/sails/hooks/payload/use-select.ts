import { type ChangeEvent, useState } from 'react';

type Props = {
  label?: string;
  labels?: Record<string, string>;
  onChange?: (value: string) => void;
};

function useSelect(items: Record<string, unknown>, props?: Props) {
  const names = Object.keys(items);
  const options = names.map((name) => ({ label: props?.labels?.[name] ?? name, value: name }));
  const label = props?.label;

  const [value, setValue] = useState(names[0]);

  const onChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    setValue(target.value);
    props?.onChange?.(target.value);
  };

  return { options, value, label, onChange };
}

export { useSelect };
