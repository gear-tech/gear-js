import { ComponentProps } from 'react';
import { FieldError, get, useFormContext } from 'react-hook-form';

import { Checkbox as UICheckbox } from './checkbox';
import { Input as UIInput } from './input';
import { Select as UISelect } from './select';
import { Textarea as UITextarea } from './textarea';

// use 'get' util as a safe way to access nested object properties:
// https://github.com/react-hook-form/error-message/blob/2cb9e332bd4ca889ac028a423328e4b3db7d4765/src/ErrorMessage.tsx#L21

const Textarea = ({ name, ...props }: ComponentProps<typeof UITextarea> & { name: string }) => {
  const { register, formState } = useFormContext();

  const error = get(formState.errors, name) as FieldError | undefined;

  return <UITextarea {...props} {...register(name)} error={error?.message} />;
};

const Input = ({ name, ...props }: ComponentProps<typeof UIInput> & { name: string }) => {
  const { register, formState } = useFormContext();

  const error = get(formState.errors, name) as FieldError | undefined;

  return <UIInput {...props} {...register(name)} error={error?.message} />;
};

const Checkbox = ({ name, ...props }: ComponentProps<typeof UICheckbox> & { name: string }) => {
  const { register } = useFormContext();

  return <UICheckbox {...props} {...register(name)} />;
};

const Select = ({ name, ...props }: ComponentProps<typeof UISelect> & { name: string }) => {
  const { register, formState } = useFormContext();

  const error = get(formState.errors, name) as FieldError | undefined;

  return <UISelect {...props} {...register(name)} error={error?.message} />;
};

export { Textarea, Input, Checkbox, Select };
