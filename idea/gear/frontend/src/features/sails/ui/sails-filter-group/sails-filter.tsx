// import { FieldValues, Path, useController, useFormContext } from 'react-hook-form';

// import { Services } from '../../types';

// import { Dropdown } from './dropdown';

// type Props<T> = {
//   heading: string;
//   services: Services;
//   type: 'functions' | 'events';
//   name: Path<T>;
//   onSubmit: (values: T) => void;
// };

// const getGroups = (services: Services, type: 'functions' | 'events') =>
//   Object.entries(services).map(([serviceName, service]) => ({
//     value: serviceName,
//     items: Object.keys(service[type]).map((item) => `${serviceName}.${item}`),
//   }));

// function SailsFilter<T extends FieldValues>({ heading, services, type, name, onSubmit }: Props<T>) {
//   const { handleSubmit } = useFormContext<T>();
//   const { field } = useController<T>({ name });

//   const handleChange = (value: string | null) => {
//     field.onChange(value);
//     void handleSubmit(onSubmit)();
//   };

//   return (
//     <Dropdown
//       heading={heading}
//       groups={getGroups(services, type)}
//       ref={field.ref}
//       value={field.value}
//       onChange={handleChange}
//       onBlur={field.onBlur}
//     />
//   );
// }

// export { SailsFilter };
