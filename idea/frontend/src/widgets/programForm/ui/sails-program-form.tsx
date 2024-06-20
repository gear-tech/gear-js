import { useBalanceFormat } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';
import { z } from 'zod';

import { useBalanceSchema, useGasCalculate, useGasLimitSchema } from '@/hooks';
import { Result } from '@/hooks/useGasCalculate/types';
import { Payload } from '@/hooks/useProgramActions/types';
import { GasField } from '@/features/gasField';
import { GasMethod } from '@/shared/config';
import { Input, ValueField, LabeledCheckbox } from '@/shared/ui';
import { PayloadForm, useConstructor, PayloadValue, PayloadValueSchema } from '@/features/sails';

import { RenderButtonsProps, SubmitHelpers } from '../model';
import styles from './ProgramForm.module.scss';

type Values = {
  value: string;
  gasLimit: string;
  programName: string;
  keepAlive: boolean;
  payload: PayloadValue;
};

const useSchema = (payloadSchema: PayloadValueSchema) => {
  const balanceSchema = useBalanceSchema();
  const gasLimitSchema = useGasLimitSchema();

  return z.object({
    payload: payloadSchema,
    value: balanceSchema,
    gasLimit: gasLimitSchema,
    keepAlive: z.boolean(),
    programName: z.string().trim().min(1),
  });
};

type FormattedValues = z.infer<ReturnType<typeof useSchema>>;

type Props = {
  source: Buffer | HexString;
  sails: Sails;
  idl: string;
  gasMethod: GasMethod;
  fileName?: string;
  renderButtons: (props: RenderButtonsProps) => ReactNode;
  onSubmit: (values: Payload, helpers: SubmitHelpers) => void;
};

const DEFAULT_VALUES = {
  value: '0',
  gasLimit: '0',
  programName: '',
  keepAlive: true,
};

const SailsProgramForm = ({ gasMethod, sails, idl, source, fileName = '', renderButtons, onSubmit }: Props) => {
  const { getFormattedGasValue } = useBalanceFormat();

  const constructor = useConstructor(sails);
  const defaultValues = { ...DEFAULT_VALUES, payload: constructor.defaultValues, programName: fileName };
  const schema = useSchema(constructor.schema);
  const form = useForm<Values, unknown, FormattedValues>({ values: defaultValues, resolver: zodResolver(schema) });

  const [gasInfo, setGasinfo] = useState<Result>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);

  const calculateGas = useGasCalculate();

  const handleGasCalculate = async () => {
    setIsGasDisabled(true);

    const values = form.getValues();

    try {
      const info = await calculateGas(gasMethod, schema.parse(values), source);
      const limit = getFormattedGasValue(info.limit).toFixed();

      form.setValue('gasLimit', limit, { shouldValidate: true });
      setGasinfo(info);
    } finally {
      setIsGasDisabled(false);
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    console.log('values: ', values);
    setIsDisabled(true);

    const payloadType = 'Bytes';
    const submitValues = { ...values, initPayload: values.payload, payloadType, idl };

    // TODO: reset form (init program page). do we need to reset on sails change?
    onSubmit(submitValues, { enableButtons: () => setIsDisabled(false), resetForm: () => {} });
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formContent}>
          <Input name="programName" label="Name" direction="y" placeholder="Enter program name" block />

          <PayloadForm direction="y" sails={sails} select={constructor.select} args={constructor.args} />

          <ValueField name="value" label="Initial value:" direction="y" block />

          <GasField
            name="gasLimit"
            label="Gas limit"
            placeholder="0"
            disabled={isGasDisabled}
            onGasCalculate={handleGasCalculate}
            direction="y"
            info={gasInfo}
            block
          />

          <LabeledCheckbox name="keepAlive" label="Account existence:" inputLabel="Keep alive" direction="y" />
        </div>

        <div className={styles.buttons}>{renderButtons({ isDisabled })}</div>
      </form>
    </FormProvider>
  );
};

export { SailsProgramForm };
