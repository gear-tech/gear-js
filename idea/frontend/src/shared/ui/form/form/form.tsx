import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { DefaultValues, FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { ZodType } from 'zod';

type FormProps<TFieldValues extends FieldValues, TTransformedValues extends FieldValues | undefined = undefined> = {
  children: ReactNode;
  className?: string;
  onSubmit: TTransformedValues extends FieldValues ? SubmitHandler<TTransformedValues> : SubmitHandler<TFieldValues>;
};

type UseFormProps<TFieldValues extends FieldValues> = {
  defaultValues: DefaultValues<TFieldValues>;
  schema?: ZodType;
};

type Props<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = undefined,
> = FormProps<TFieldValues, TTransformedValues> & UseFormProps<TFieldValues>;

const Form = <TFieldValues extends FieldValues, TTransformedValues extends FieldValues | undefined = undefined>({
  defaultValues,
  schema,
  children,
  className,
  onSubmit,
}: Props<TFieldValues, TTransformedValues>) => {
  const resolver = schema ? zodResolver(schema) : undefined;

  const methods = useForm<TFieldValues, unknown, TTransformedValues>({ defaultValues, resolver });
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};

export { Form };
