import type { ProgramMetadata } from '@gear-js/api';
import { useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { Input as GearInput } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import type { HexString } from '@polkadot/util/types';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { PayloadValue } from '@/entities/formPayload';
import { FormPayload, getPayloadFormValues, getResetPayloadValue, getSubmitPayload } from '@/features/formPayload';
import { GasField } from '@/features/gasField';
import { useBalanceSchema, useChangeEffect, useGasCalculate, useGasLimitSchema } from '@/hooks';
import type { Result } from '@/hooks/useGasCalculate/types';
import type { GasMethod } from '@/shared/config';
import { getErrorMessage, isHex } from '@/shared/helpers';
import { Box, Input, LabeledCheckbox, ValueField } from '@/shared/ui';

import { type FormValues, INITIAL_VALUES, type SubmitHelpers } from '../model';

import styles from './ProgramForm.module.scss';

function useValidationSchema() {
  const balanceSchema = useBalanceSchema();
  const gasLimitSchema = useGasLimitSchema();

  return z.object({
    value: balanceSchema,
    gasLimit: gasLimitSchema,

    // passthrough properties to mimic legacy yup logic
    payloadType: z.string().trim().min(1, 'This field is required'),
    payload: z.unknown().transform((value) => value as PayloadValue),
    keepAlive: z.boolean(),
    programName: z.string().trim(),
  });
}

type Props = {
  source: Buffer | HexString;
  metadata: ProgramMetadata | undefined;
  gasMethod: GasMethod;
  fileName?: string;
  onSubmit: (values: FormValues, helpers: SubmitHelpers) => void;
};

const ProgramForm = ({ gasMethod, metadata, source, fileName = '', onSubmit }: Props) => {
  const { getFormattedGasValue } = useBalanceFormat();
  const alert = useAlert();
  const schema = useValidationSchema();

  const defaultValues = { ...INITIAL_VALUES, programName: fileName };
  const methods = useForm({ defaultValues, resolver: zodResolver(schema) });
  const { getValues, setValue, reset } = methods;

  const [gasInfo, setGasinfo] = useState<Result>();
  const [isGasDisabled, setIsGasDisabled] = useState(false);

  const calculateGas = useGasCalculate();

  const resetForm = () => {
    const values = getValues();
    const payload = getResetPayloadValue(values.payload as PayloadValue);

    reset({ ...defaultValues, payload });
    setGasinfo(undefined);
  };

  const handleGasCalculate = async () => {
    setIsGasDisabled(true);

    const values = getValues();

    const preparedValues = {
      ...values,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
      payload: getSubmitPayload(values.payload as PayloadValue),
    };

    try {
      const info = await calculateGas(gasMethod, preparedValues, source, metadata);
      const limit = getFormattedGasValue(info.limit).toFixed();

      setValue('gasLimit', limit, { shouldValidate: true });
      setGasinfo(info);
    } catch (error) {
      alert.error(getErrorMessage(error));
    } finally {
      setIsGasDisabled(false);
    }
  };

  const handleSubmitForm = (values: z.infer<typeof schema>) => {
    const { value, payload, gasLimit, programName, payloadType, keepAlive } = values;

    const data = {
      value,
      gasLimit,
      payloadType: metadata ? undefined : payloadType,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
      payload: metadata ? getSubmitPayload(payload) : payload,
      programName,
      keepAlive,
    };

    onSubmit(data, { resetForm });
  };

  const typeIndex = metadata?.types.init.input;
  const isTypeIndex = typeIndex !== undefined && typeIndex !== null;

  const payloadFormValues = useMemo(
    () => (metadata && isTypeIndex ? getPayloadFormValues(metadata, typeIndex) : undefined),
    [metadata, isTypeIndex, typeIndex],
  );

  useChangeEffect(() => {
    if (!metadata) resetForm();
  }, [metadata]);

  return (
    <FormProvider {...methods}>
      <form id="programForm" onSubmit={methods.handleSubmit(handleSubmitForm)} className={styles.form}>
        <Box className={styles.inputs}>
          {isHex(source) && <GearInput label="Code ID" direction="y" value={source} readOnly block />}

          <Input name="programName" label="Name" direction="y" placeholder="Enter program name" block />

          {!metadata && <Input name="payloadType" label="Initial payload type" direction="y" block />}

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

          <LabeledCheckbox name="keepAlive" label="Account protection:" inputLabel="Keep alive" direction="y" />
        </Box>

        <Box>
          <FormPayload name="payload" label="Initial payload" direction="y" values={payloadFormValues} />
        </Box>
      </form>
    </FormProvider>
  );
};

export { ProgramForm };
