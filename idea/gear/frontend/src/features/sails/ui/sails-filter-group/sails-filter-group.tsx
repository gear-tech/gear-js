import { FieldValues, Path, PathValue } from 'react-hook-form';

import { FilterGroup, Radio } from '@/features/filters';

import { Functions, Services } from '../../types';

type Props<T> = {
  heading: string;
  name: Path<T>;
  functions: Services | Functions | undefined;
  onSubmit: (values: T) => void;
};

function SailsFilterGroup<T extends FieldValues>({ heading, name, functions, onSubmit }: Props<T>) {
  if (!functions) return null;

  const props = { name, onSubmit };
  type Value = PathValue<T, Path<T>>;

  return (
    <FilterGroup title={heading} {...props}>
      <Radio label="None" value={'' as Value} {...props} />

      {Object.keys(functions).map((fnName) => (
        <Radio key={fnName} value={fnName as Value} label={fnName} {...props} />
      ))}
    </FilterGroup>
  );
}

export { SailsFilterGroup };
