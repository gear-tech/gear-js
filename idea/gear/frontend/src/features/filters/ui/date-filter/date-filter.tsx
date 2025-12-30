import { FieldValues, useFormContext, useController, Path } from 'react-hook-form';

import { DateRangeInput } from './date-range-input';

type Props<T> = {
  fromName: Path<T>;
  toName: Path<T>;
  onSubmit: (values: T) => void;
};

function DateFilter<T extends FieldValues>({ fromName, toName, onSubmit }: Props<T>) {
  const { handleSubmit } = useFormContext<T>();

  const { field: fromField } = useController<T>({ name: fromName });
  const { field: toField } = useController<T>({ name: toName });
  const value = { from: fromField.value, to: toField.value };

  const handleChange = ({ from, to }: { from: string; to: string }) => {
    fromField.onChange(from);
    toField.onChange(to);

    void handleSubmit(onSubmit)();
  };

  return <DateRangeInput value={value} onChange={handleChange} />;
}

export { DateFilter };
