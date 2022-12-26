import { useState, useMemo, useRef, useEffect, ReactChild } from 'react';
import { FormApi } from 'final-form';
import { Form } from 'react-final-form';
import { ProgramMetadata, Hex, getProgramMetadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';

import { useGasCalculate, useChangeEffect } from 'hooks';
import { Result } from 'hooks/useGasCalculate/types';
import { Payload } from 'hooks/useProgramActions/types';
import { FormPayload, getSubmitPayload, getPayloadFormValues } from 'features/formPayload';
import { FormPayloadType } from 'features/formPayloadType';
import { GasField } from 'features/gasField';
import { GasMethod } from 'shared/config';
import { getValidation } from 'shared/helpers';
import { FormInput } from 'shared/ui/form';

import styles from './ProgramForm.module.scss';
import { getValidationSchema } from '../helpers';
import { INITIAL_VALUES, FormValues, RenderButtonsProps, SubmitHelpers } from '../model';

type Props = {
  source: Buffer | Hex;
  metaHex: Hex | undefined;
  metadata: ProgramMetadata | undefined;
  gasMethod: GasMethod;
  renderButtons: (props: RenderButtonsProps) => ReactChild;
  onSubmit: (values: Payload, helpers: SubmitHelpers) => void;
};

const ProgramForm = (props: Props) => {
  const { gasMethod, metaHex, metadata, source, renderButtons, onSubmit } = props;

  const { api } = useApi();

  const formApi = useRef<FormApi<FormValues>>();

  const [gasInfo, setGasinfo] = useState<Result>();
  const [isDisabled, setIsDisables] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);

  const calculateGas = useGasCalculate();

  const handleGasCalculate = async () => {
    if (!formApi.current) return;

    setIsGasDisabled(true);

    const { values } = formApi.current.getState();
    const preparedValues = { ...values, payload: getSubmitPayload(values.payload) };

    try {
      const info = await calculateGas(gasMethod, preparedValues, source, metadata);

      formApi.current.change('gasLimit', info.limit);
      setGasinfo(info);
    } finally {
      setIsGasDisabled(false);
    }
  };

  const handleSubmitForm = (values: FormValues) => {
    if (!formApi.current) return;

    setIsDisables(true);

    const { value, payload, gasLimit, programName, payloadType } = values;

    const data: Payload = {
      value,
      gasLimit,
      metaHex,
      metadata,
      programName,
      payloadType: metadata ? undefined : payloadType,
      initPayload: metadata ? getSubmitPayload(payload) : payload,
    };

    onSubmit(data, { enableButtons: () => setIsDisables(false), resetForm: formApi.current.reset });
  };

  const deposit = api.existentialDeposit.toNumber();
  const maxGasLimit = api.blockGasLimit.toNumber();

  // const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);
  const payloadFormValues = undefined;

  const validation = useMemo(
    () => {
      const schema = getValidationSchema({ deposit, metadata, maxGasLimit });

      return getValidation(schema);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata],
  );

  useChangeEffect(() => {
    if (!metadata) {
      formApi.current?.restart();
      setGasinfo(undefined);
    }
  }, [metadata]);

  return (
    <Form validateOnBlur initialValues={INITIAL_VALUES} validate={validation} onSubmit={handleSubmitForm}>
      {({ form, handleSubmit }) => {
        formApi.current = form;

        return (
          <form onSubmit={handleSubmit}>
            <div className={styles.formContent}>
              <FormInput name="programName" label="Name" direction="y" placeholder="Enter program name" block />

              <FormPayload name="payload" label="Initial payload" direction="y" values={payloadFormValues} />

              {!metadata && <FormPayloadType name="payloadType" label="Initial payload type" direction="y" block />}

              <FormInput min={0} type="number" name="value" label="Initial value" placeholder="0" direction="y" block />

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
            </div>

            <div className={styles.buttons}>{renderButtons({ isDisabled })}</div>
          </form>
        );
      }}
    </Form>
  );
};

export { ProgramForm };
