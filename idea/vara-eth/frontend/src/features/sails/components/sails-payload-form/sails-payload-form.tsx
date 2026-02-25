import {
  Fields,
  getDefaultPayloadValue,
  getPayloadSchema,
  getResetPayloadValue,
  ISailsFuncArg,
  PayloadValue,
} from '@gear-js/sails-payload-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentProps, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';
import { Hex } from 'viem';
import { z } from 'zod';

import { Checkbox, Input, Textarea } from '@/components';
import { Select } from '@/components/form/select';

import { FormattedPayloadValue } from '../../lib';
import { Fieldset } from '../fieldset';

import styles from './sails-payload-form.module.scss';

type Props = {
  id: string;
  sails: Sails;
  args: ISailsFuncArg[];
  encode: (...params: unknown[]) => Hex;
  onSubmit: (payload: FormattedPayloadValue) => Promise<unknown>;
};

const GridInput = ({ ...props }: ComponentProps<typeof Input>) => <Input {...props} className={styles.input} />;

const GridTextarea = ({ ...props }: ComponentProps<typeof Textarea>) => (
  <Textarea {...props} className={styles.textarea} />
);

const GridSelect = ({ ...props }: ComponentProps<typeof Select>) => <Select {...props} className={styles.select} />;

const GridCheckbox = ({ ...props }: ComponentProps<typeof Checkbox>) => (
  <Checkbox {...props} className={styles.checkbox} />
);

const getSchema = (sails: Sails, args: ISailsFuncArg[], encode: (...params: unknown[]) => Hex) =>
  getPayloadSchema(sails, args, encode).transform(({ encoded, decoded }) => ({
    encoded,

    // TODO: maybe @gear-js/sails-js-payload should use arg names instead of indexes?
    formatted: Object.values(decoded)
      .map((value, index) => `${args[index].name}: ${JSON.stringify(value)}`)
      .join(', '),
  }));

const SailsPayloadForm = ({ id, sails, args, encode, onSubmit }: Props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultValues = useMemo(() => ({ payload: getDefaultPayloadValue(sails, args) }), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const schema = useMemo(() => z.object({ payload: getSchema(sails, args, encode) }), []);

  const form = useForm({
    values: defaultValues,
    resolver: zodResolver(schema),
  });

  const reset = () => {
    const values = form.getValues();
    const resetValues = { payload: getResetPayloadValue(values.payload as PayloadValue) as Record<string, unknown> };

    form.reset(resetValues);
  };

  const handleSubmit = form.handleSubmit(({ payload }) =>
    onSubmit(payload)
      .then(() => reset())
      .catch((error) => console.error(error)),
  );

  return (
    <FormProvider {...form}>
      <form id={id} onSubmit={handleSubmit} className={styles.form}>
        <Fields
          sails={sails}
          args={args}
          render={{
            ui: { fieldset: Fieldset, select: GridSelect },
            rhf: { input: GridInput, textarea: GridTextarea, checkbox: GridCheckbox },
          }}
        />
      </form>
    </FormProvider>
  );
};

export { SailsPayloadForm };
