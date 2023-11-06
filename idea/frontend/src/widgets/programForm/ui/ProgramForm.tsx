import { ProgramMetadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Input } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import BigNumber from 'bignumber.js';
import { useState, useMemo, ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useGasCalculate, useChangeEffect, useBalanceMultiplier, useGasMultiplier } from '@/hooks';
import { Result } from '@/hooks/useGasCalculate/types';
import { Payload } from '@/hooks/useProgramActions/types';
import { FormPayload, getSubmitPayload, getPayloadFormValues } from '@/features/formPayload';
import { GasField } from '@/features/gasField';
import { GasMethod } from '@/shared/config';
import { FormInput, ValueField } from '@/shared/ui/form';
import { LabeledCheckbox } from '@/shared/ui';
import { resetPayloadValue } from '@/widgets/messageForm/helpers';

import { getValidationSchema } from '../helpers';
import { INITIAL_VALUES, FormValues, RenderButtonsProps, SubmitHelpers } from '../model';
import styles from './ProgramForm.module.scss';

type Props = {
  source: Buffer | HexString;
  metaHex: HexString | undefined;
  metadata: ProgramMetadata | undefined;
  gasMethod: GasMethod;
  fileName?: string;
  renderButtons: (props: RenderButtonsProps) => ReactNode;
  onSubmit: (values: Payload, helpers: SubmitHelpers) => void;
};

const ProgramForm = (props: Props) => {
  const { gasMethod, metaHex, metadata, source, fileName = '', renderButtons, onSubmit } = props;

  const defaultValues = { ...INITIAL_VALUES, programName: fileName };
  // TODOFORM:
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const methods = useForm<FormValues>({ defaultValues });
  const { register, getValues, setValue, reset } = methods;

  const { api, isApiReady, isVaraVersion } = useApi();

  const [gasInfo, setGasinfo] = useState<Result>();
  const [isDisabled, setIsDisables] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);

  const { balanceMultiplier, decimals } = useBalanceMultiplier();
  const { gasMultiplier } = useGasMultiplier();
  const calculateGas = useGasCalculate();

  const resetForm = () => {
    const values = getValues();
    const payload = resetPayloadValue(values.payload);

    reset({ ...defaultValues, payload });
    setIsDisables(false);
    setGasinfo(undefined);
  };

  const handleGasCalculate = async () => {
    setIsGasDisabled(true);

    const values = getValues();

    const preparedValues = {
      ...values,
      value: BigNumber(values.value).multipliedBy(balanceMultiplier).toFixed(),
      payload: getSubmitPayload(values.payload),
    };

    try {
      const info = await calculateGas(gasMethod, preparedValues, source, metadata);
      const limit = BigNumber(info.limit).dividedBy(gasMultiplier).toFixed();

      setValue('gasLimit', limit);
      setGasinfo(info);
    } finally {
      setIsGasDisabled(false);
    }
  };

  const handleSubmitForm = (values: FormValues) => {
    setIsDisables(true);

    const { value, payload, gasLimit, programName, payloadType, keepAlive } = values;

    const data: Payload = {
      value: BigNumber(value).multipliedBy(balanceMultiplier).toFixed(),
      gasLimit: BigNumber(gasLimit).multipliedBy(gasMultiplier).toFixed(),
      payloadType: metadata ? undefined : payloadType,
      initPayload: metadata ? getSubmitPayload(payload) : payload,
      metaHex,
      metadata,
      programName,
      keepAlive,
    };

    onSubmit(data, { enableButtons: () => setIsDisables(false), resetForm });
  };

  const deposit = isApiReady ? api.existentialDeposit.toNumber() : 0;
  const maxGasLimit = isApiReady ? api.blockGasLimit.toNumber() : 0;

  const typeIndex = metadata?.types.init.input;
  const isTypeIndex = typeIndex !== undefined && typeIndex !== null;

  const payloadFormValues = useMemo(
    () => (metadata && isTypeIndex ? getPayloadFormValues(metadata, typeIndex) : undefined),
    [metadata, isTypeIndex, typeIndex],
  );

  const validation = useMemo(
    () => {
      const schema = getValidationSchema({
        deposit: BigNumber(deposit).dividedBy(balanceMultiplier),
        metadata,
        maxGasLimit: BigNumber(maxGasLimit).dividedBy(gasMultiplier),
        balanceMultiplier,
        decimals,
        gasMultiplier,
      });

      // return getValidation(schema);
      return;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata],
  );

  useChangeEffect(() => {
    if (!metadata) resetForm();
  }, [metadata]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
        <div className={styles.formContent}>
          <FormInput name="programName" label="Name" direction="y" placeholder="Enter program name" block />

          <FormPayload name="payload" label="Initial payload" direction="y" values={payloadFormValues} />

          {!metadata && <Input label="Initial payload type" direction="y" block {...register('payloadType')} />}

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

          {!isVaraVersion && (
            <LabeledCheckbox name="keepAlive" label="Account existence:" inputLabel="Keep alive" direction="y" />
          )}
        </div>

        <div className={styles.buttons}>{renderButtons({ isDisabled })}</div>
      </form>
    </FormProvider>
  );
};

export { ProgramForm };
