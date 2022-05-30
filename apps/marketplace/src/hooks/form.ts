import { ChangeEvent, useState } from 'react';

const useForm = <Values>(initValues: Values) => {
  const [values, setValues] = useState(initValues);

  const changeValue = (key: string, value: string | FileList | File | undefined) => {
    setValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  // TODO: types
  const handleChange = ({ target: { name, value, files } }: ChangeEvent<any>) => {
    if (files?.length > 0) {
      changeValue(name, files.length === 1 ? files[0] : files);
    } else {
      changeValue(name, value);
    }
  };

  const handleFileChange = ({ target: { name, files } }: ChangeEvent<HTMLInputElement>) => {
    if (files && files.length > 0) {
      changeValue(name, files.length === 1 ? files[0] : files);
    } else {
      changeValue(name, undefined);
    }
  };

  const resetValues = () => {
    setValues(initValues);
  };

  return { values, changeValue, handleChange, handleFileChange, resetValues };
};

const useInput = <Value>(initValue: Value) => {
  const [value, setValue] = useState(initValue);

  // TOFIX: any
  const handleChange = ({ target }: ChangeEvent<any>) => {
    setValue(target.type === 'checkbox' ? target.checked : target.value);
  };

  const resetValue = () => {
    setValue(initValue);
  };

  return { value, handleChange, resetValue };
};

export { useForm, useInput };
