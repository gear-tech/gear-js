import { ChangeEvent, useState } from 'react';

const useForm = <Values>(initValues: Values) => {
  const [values, setValues] = useState(initValues);

  const changeValue = (key: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    changeValue(name, value);
  };

  const resetValues = () => {
    setValues(initValues);
  };

  return { values, changeValue, handleChange, resetValues };
};

// const useInput = <Value>(initValue: Value) => {
//   const [value, setValue] = useState(initValue);

//   // TOFIX: any
//   const handleChange = ({ target }: ChangeEvent<any>) => {
//     setValue(target.type === 'checkbox' ? target.checked : target.value);
//   };

//   const resetValue = () => {
//     setValue(initValue);
//   };

//   return { value, handleChange, resetValue };
// };

export default useForm;
