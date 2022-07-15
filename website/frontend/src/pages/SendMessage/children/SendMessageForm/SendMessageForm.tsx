import { useMemo } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { Metadata } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { getValidationSchema } from './Schema';
import { INITIAL_VALUES } from './const';
import { FormValues, SetFieldValue } from './types';

import { GasMethod } from 'consts';
import { useGasCalculate, useSendMessage } from 'hooks';
import { FormInput, FormPayload, FormPayloadType, FormNumberFormat, formStyles } from 'components/common/Form';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';
import sendMessageSVG from 'assets/images/message.svg';

type Props = {
  metadata?: Metadata;
};

const SendMessageForm = ({ metadata }: Props) => {
  const encodeType = metadata?.handle_input;

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validationSchema = useMemo(() => getValidationSchema(encodeType, metadata), [metadata, encodeType]);

  const sendMessage = useSendMessage();
  const calculateGas = useGasCalculate();

  const handleSubmit = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const payloadType = metadata ? void 0 : values.payloadType;

    const message = {
      value: values.value.toString(),
      payload: getSubmitPayload(values.payload),
      gasLimit: values.gasLimit.toString(),
      replyToId: values.destination,
      destination: values.destination,
    };

    const callback = () => {
      const { payload } = payloadFormValues ?? INITIAL_VALUES;

      helpers.resetForm({
        values: {
          ...INITIAL_VALUES,
          destination: values.destination,
          payload,
        },
      });
    };

    sendMessage('handle', message, callback, metadata, payloadType).catch(() => helpers.setSubmitting(false));
  };

  const handleCalculateGas = (values: FormValues, setFieldValue: SetFieldValue) => () =>
    calculateGas(GasMethod.Handle, values, null, metadata, values.destination).then((gasLimit) =>
      setFieldValue('gasLimit', gasLimit)
    );

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validateOnChange={false}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid, isSubmitting, setFieldValue }) => {
        const isDisabled = !isValid || isSubmitting;

        return (
          <Form data-testid="sendMessageForm" className={formStyles.largeForm}>
            <FormInput name="destination" label="Destination" />

            <FormPayload name="payload" label="Payload" values={payloadFormValues} />

            {!metadata && <FormPayloadType name="payloadType" label="Payload type" />}

            <FormNumberFormat
              name="gasLimit"
              label="Gas limit"
              placeholder="1,000,000,000"
              thousandSeparator
              allowNegative={false}
            />

            <FormInput type="number" name="value" label="Value" placeholder="20000" />

            <div className={formStyles.formButtons}>
              <Button text="Calculate Gas" onClick={handleCalculateGas(values, setFieldValue)} disabled={isDisabled} />
              <Button type="submit" icon={sendMessageSVG} text="Send message" disabled={isDisabled} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export { SendMessageForm };
