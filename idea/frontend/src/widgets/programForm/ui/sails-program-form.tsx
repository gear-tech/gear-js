import { useBalanceFormat } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';
import { z } from 'zod';

import { useGasCalculate } from '@/hooks';
import { Result } from '@/hooks/useGasCalculate/types';
import { Payload } from '@/hooks/useProgramActions/types';
import { getSubmitPayload, getResetPayloadValue } from '@/features/formPayload';
import { GasField } from '@/features/gasField';
import { GasMethod } from '@/shared/config';
import { Input, ValueField, LabeledCheckbox } from '@/shared/ui';
import { PayloadForm, useConstructor } from '@/features/sails';

import { RenderButtonsProps, SubmitHelpers } from '../model';
import styles from './ProgramForm.module.scss';

type Props = {
  source: Buffer | HexString;
  sails: Sails;
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

const SailsProgramForm = ({ gasMethod, sails, source, fileName = '', renderButtons, onSubmit }: Props) => {
  const { getChainBalanceValue, getFormattedGasValue, getChainGasValue } = useBalanceFormat();

  const constructor = useConstructor(sails);
  const defaultValues = { ...DEFAULT_VALUES, payload: constructor.defaultValues, programName: fileName };
  const schema = z.object({ payload: constructor.schema });
  const form = useForm({ values: defaultValues, resolver: zodResolver(schema) });
  const { getValues, setValue, reset } = form;

  const [gasInfo, setGasinfo] = useState<Result>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);

  const calculateGas = useGasCalculate();

  const resetForm = () => {
    const values = getValues();
    const payload = getResetPayloadValue(values.payload);

    // reset({ ...defaultValues, payload });
    setIsDisabled(false);
    setGasinfo(undefined);
  };

  const handleGasCalculate = async () => {
    setIsGasDisabled(true);

    const values = getValues();
    const payloadType = 'Bytes';

    const preparedValues = {
      ...values,
      payloadType,
      value: getChainBalanceValue(values.value).toFixed(),
      payload: getSubmitPayload(values.payload),
    };

    try {
      const info = await calculateGas(gasMethod, preparedValues, source);
      const limit = getFormattedGasValue(info.limit).toFixed();

      setValue('gasLimit', limit, { shouldValidate: true });
      setGasinfo(info);
    } finally {
      setIsGasDisabled(false);
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    console.log('values: ', values);
    // setIsDisabled(true);

    // const { value, payload, gasLimit, programName, payloadType, keepAlive } = values;

    // const data = {
    //   value: getChainBalanceValue(value).toFixed(),
    //   gasLimit: getChainGasValue(gasLimit).toFixed(),
    // payloadType: metadata ? undefined : payloadType,
    // initPayload: metadata ? getSubmitPayload(payload) : payload,
    // metaHex,
    // metadata,
    //   programName,
    //   keepAlive,
    // };

    // onSubmit(data, { enableButtons: () => setIsDisables(false), resetForm });
  });

  // useChangeEffect(() => {
  //   if (!metadata) resetForm();
  // }, [metadata]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formContent}>
          <Input name="programName" label="Name" direction="y" placeholder="Enter program name" block />

          {sails && <PayloadForm sails={sails} select={constructor.select} args={constructor.args} />}

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
