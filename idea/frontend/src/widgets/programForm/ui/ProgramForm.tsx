import { ProgramMetadata } from '@gear-js/api';
import { useBalanceFormat } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useGasCalculate, useChangeEffect, useValidationSchema } from '@/hooks';
import { Result } from '@/hooks/useGasCalculate/types';
import { FormPayload, getSubmitPayload, getPayloadFormValues, getResetPayloadValue } from '@/features/formPayload';
import { GasField } from '@/features/gasField';
import { GasMethod } from '@/shared/config';
import { Input, ValueField, LabeledCheckbox, Box } from '@/shared/ui';

import { INITIAL_VALUES, FormValues, SubmitHelpers } from '../model';
import styles from './ProgramForm.module.scss';

type Props = {
  source: Buffer | HexString;
  metadata: ProgramMetadata | undefined;
  gasMethod: GasMethod;
  fileName?: string;
  onSubmit: (values: FormValues, helpers: SubmitHelpers) => void;
};

const ProgramForm = ({ gasMethod, metadata, source, fileName = '', onSubmit }: Props) => {
  const { getChainBalanceValue, getFormattedGasValue, getChainGasValue } = useBalanceFormat();
  const schema = useValidationSchema();

  const defaultValues = { ...INITIAL_VALUES, programName: fileName };
  // TODOFORM:
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const methods = useForm<FormValues>({ defaultValues, resolver: yupResolver(schema) });
  const { getValues, setValue, reset } = methods;

  const [gasInfo, setGasinfo] = useState<Result>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);

  const calculateGas = useGasCalculate();

  const resetForm = () => {
    const values = getValues();
    const payload = getResetPayloadValue(values.payload);

    reset({ ...defaultValues, payload });
    setIsDisabled(false);
    setGasinfo(undefined);
  };

  const handleGasCalculate = async () => {
    setIsGasDisabled(true);

    const values = getValues();

    const preparedValues = {
      ...values,
      value: getChainBalanceValue(values.value).toFixed(),
      payload: getSubmitPayload(values.payload),
    };

    try {
      const info = await calculateGas(gasMethod, preparedValues, source, metadata);
      const limit = getFormattedGasValue(info.limit).toFixed();

      setValue('gasLimit', limit, { shouldValidate: true });
      setGasinfo(info);
    } finally {
      setIsGasDisabled(false);
    }
  };

  const handleSubmitForm = (values: FormValues) => {
    setIsDisabled(true);

    const { value, payload, gasLimit, programName, payloadType, keepAlive } = values;

    const data = {
      value: getChainBalanceValue(value).toFixed(),
      gasLimit: getChainGasValue(gasLimit).toFixed(),
      payloadType: metadata ? undefined : payloadType,
      payload: metadata ? getSubmitPayload(payload) : payload,
      programName,
      keepAlive,
    };

    onSubmit(data, { enableButtons: () => setIsDisabled(false), resetForm });
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
      <form onSubmit={methods.handleSubmit(handleSubmitForm)} className={styles.form}>
        <Box className={styles.inputs}>
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

          <LabeledCheckbox name="keepAlive" label="Account existence:" inputLabel="Keep alive" direction="y" />
        </Box>

        <Box>
          <FormPayload name="payload" label="Initial payload" direction="y" values={payloadFormValues} />
        </Box>
      </form>
    </FormProvider>
  );
};

export { ProgramForm };
