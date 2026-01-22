import {
  getDefaultPayloadValue,
  getPayloadSchema,
  getResetPayloadValue,
  ISailsFuncArg,
  PayloadValue,
} from '@gear-js/sails-payload-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@vara-eth/api';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';
import { z } from 'zod';

import { SailsPayloadFields } from '../sails-payload-fields';

type Props = {
  id: string;
  sails: Sails;
  args: ISailsFuncArg[];
  encode: (...params: unknown[]) => HexString;
  onSubmit: (payload: HexString) => Promise<unknown>;
};

type Values = { payload: PayloadValue };
type FormattedValues = { payload: HexString };

const SailsPayloadForm = ({ id, sails, args, encode, onSubmit }: Props) => {
  const defaultValues = { payload: getDefaultPayloadValue(sails, args) };
  const schema = z.object({ payload: getPayloadSchema(sails, args, encode) });

  const form = useForm<Values, unknown, FormattedValues>({
    values: defaultValues,
    resolver: zodResolver(schema),
  });

  const reset = () => {
    const values = form.getValues();
    const resetValues = { payload: getResetPayloadValue(values.payload) };

    form.reset(resetValues);
  };

  const handleSubmit = form.handleSubmit(({ payload }) =>
    onSubmit(payload)
      .then(() => reset())
      .catch((error) => console.error(error)),
  );

  return (
    <FormProvider {...form}>
      <form id={id} onSubmit={handleSubmit}>
        <SailsPayloadFields sails={sails} args={args} />
      </form>
    </FormProvider>
  );
};

export { SailsPayloadForm };
