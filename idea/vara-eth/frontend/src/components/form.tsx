import { PropsWithChildren, useId } from 'react';
import { FieldError, get, useFormContext } from 'react-hook-form';

type Props = {
  label: string;
  name: string;
};

const Fieldset = ({ legend, children }: PropsWithChildren & { legend: string }) => (
  <fieldset>
    <legend>{legend}</legend>
    {children}
  </fieldset>
);

const Textarea = ({ name, ...props }: Props) => {
  const id = useId();
  const { register, formState } = useFormContext();

  // use 'get' util as a safe way to access nested object properties:
  // https://github.com/react-hook-form/error-message/blob/2cb9e332bd4ca889ac028a423328e4b3db7d4765/src/ErrorMessage.tsx#L21
  const error = get(formState.errors, name) as FieldError | undefined;

  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      <textarea id={id} {...register(name)} {...props} />
    </div>
  );
};

const Input = ({ name, ...props }: Props) => {
  const id = useId();
  const { register, formState } = useFormContext();

  // use 'get' util as a safe way to access nested object properties:
  // https://github.com/react-hook-form/error-message/blob/2cb9e332bd4ca889ac028a423328e4b3db7d4765/src/ErrorMessage.tsx#L21
  const error = get(formState.errors, name) as FieldError | undefined;

  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      <input id={id} {...register(name)} {...props} />
    </div>
  );
};

const Checkbox = ({ name, ...props }: Props) => {
  const id = useId();
  const { register, formState } = useFormContext();

  // use 'get' util as a safe way to access nested object properties:
  // https://github.com/react-hook-form/error-message/blob/2cb9e332bd4ca889ac028a423328e4b3db7d4765/src/ErrorMessage.tsx#L21
  const error = get(formState.errors, name) as FieldError | undefined;

  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      <input type="checkbox" id={id} {...register(name)} {...props} />
    </div>
  );
};

export { Fieldset, Textarea, Input as FormInput, Checkbox };
