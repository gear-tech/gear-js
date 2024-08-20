import { useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { Input as GearInput } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';
import { z } from 'zod';

import { useBalanceSchema, useGasCalculate, useGasLimitSchema } from '@/hooks';
import { Result } from '@/hooks/useGasCalculate/types';
import { GasField } from '@/features/gasField';
import { GasMethod } from '@/shared/config';
import { Input, ValueField, LabeledCheckbox, Box } from '@/shared/ui';
import { PayloadForm, useConstructor, PayloadValue, PayloadValueSchema, getResetPayloadValue } from '@/features/sails';
import { getErrorMessage, isHex } from '@/shared/helpers';

import { SubmitHelpers } from '../model';
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
    programName: z.string().trim(),
  });
};

type FormattedValues = z.infer<ReturnType<typeof useSchema>>;

type Props = {
  source: Buffer | HexString;
  sails: Sails;
  gasMethod: GasMethod;
  fileName?: string;
  onSubmit: (values: FormattedValues, helpers: SubmitHelpers) => void;
};

const DEFAULT_VALUES = {
  value: '0',
  gasLimit: '0',
  programName: '',
  keepAlive: true,
};

const SailsProgramForm = ({ gasMethod, sails, source, fileName = '', onSubmit }: Props) => {
  const { getFormattedGasValue } = useBalanceFormat();
  const alert = useAlert();

  const constructor = useConstructor(sails);
  const defaultValues = { ...DEFAULT_VALUES, payload: constructor.defaultValues, programName: fileName };
  const schema = useSchema(constructor.schema);
  const form = useForm<Values, unknown, FormattedValues>({ values: defaultValues, resolver: zodResolver(schema) });

  const [gasInfo, setGasinfo] = useState<Result>();
  const [isGasDisabled, setIsGasDisabled] = useState(false);

  const calculateGas = useGasCalculate();

  const resetForm = () => {
    const values = form.getValues();
    const resetValues = { ...DEFAULT_VALUES, payload: getResetPayloadValue(values.payload) };

    form.reset(resetValues);
    setGasinfo(undefined);
  };

  const handleGasCalculate = async () => {
    setIsGasDisabled(true);

    const values = form.getValues();

    try {
      const info = await calculateGas(gasMethod, schema.parse(values), source);
      const limit = getFormattedGasValue(info.limit).toFixed();

      form.setValue('gasLimit', limit, { shouldValidate: true });
      setGasinfo(info);
    } catch (error) {
      alert.error(getErrorMessage(error));
    } finally {
      setIsGasDisabled(false);
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    const payloadType = 'Bytes';
    const submitValues = { ...values, initPayload: values.payload, payloadType };

    onSubmit(submitValues, { resetForm });
  });

  return (
    <FormProvider {...form}>
      <form id="programForm" onSubmit={handleSubmit} className={styles.form}>
        <Box className={styles.inputs}>
          {isHex(source) && <GearInput label="Code ID" direction="y" value={source} readOnly block />}

          <Input name="programName" label="Name" direction="y" placeholder="Enter program name" block />

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
        </Box>

        <Box>
          <PayloadForm direction="y" sails={sails} select={constructor.select} args={constructor.args} />
        </Box>
      </form>
    </FormProvider>
  );
};

export { SailsProgramForm };
