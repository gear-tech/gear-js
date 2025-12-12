import { FieldValues, Path, useController, useFormContext } from 'react-hook-form';

import { Services } from '../../types';

import { Dropdown } from './dropdown';

type Props<T> = {
  label: string;
  services: Services;
  type: 'functions' | 'events';
  name: Path<T>;
  onSubmit: (values: T) => void;
};

const getGroups = (services: Services, type: 'functions' | 'events') =>
  Object.entries(services).map(([serviceName, service]) => ({
    value: serviceName,
    items: [serviceName, ...Object.keys(service[type]).map((item) => `${serviceName}.${item}`)],
  }));

function SailsFilter<T extends FieldValues>({ label, services, type, name, onSubmit }: Props<T>) {
  const { handleSubmit } = useFormContext<T>();
  const { field } = useController<T>({ name });

  const handleChange = (value: string) => {
    field.onChange(value);
    void handleSubmit(onSubmit)();
  };

  return (
    <Dropdown
      label={label}
      groups={getGroups(services, type)}
      value={field.value}
      inputProps={{ ref: field.ref, onBlur: field.onBlur }}
      onChange={handleChange}
    />
  );
}

export { SailsFilter };
