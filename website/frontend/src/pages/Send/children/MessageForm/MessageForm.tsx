import { useMemo } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { Metadata } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { getValidationSchema } from './Schema';
import { FormValues, SetFieldValue } from './types';

import { calculateGas } from 'helpers';
import { useSendMessage } from 'hooks';
import { MIN_GAS_LIMIT } from 'consts';
import { FormInput, FormPayload, FormPayloadType, FormNumberFormat, formStyles } from 'components/common/Form';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';
import sendMessageSVG from 'assets/images/message.svg';

type Props = {
  id: string;
  isReply: boolean;
  metadata?: Metadata;
};

const MessageForm = ({ id, isReply, metadata }: Props) => {
  const alert = useAlert();
  const { api } = useApi();

  const method = isReply ? 'reply' : 'handle';
  const encodeType = isReply ? metadata?.async_handle_input : metadata?.handle_input;

  const initialValues: FormValues = {
    value: 0,
    payload: '0x00',
    gasLimit: MIN_GAS_LIMIT,
    payloadType: 'Bytes',
    destination: id,
  };

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validationSchema = useMemo(() => getValidationSchema(encodeType, metadata), [metadata, encodeType]);

  const sendMessage = useSendMessage();

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
      const { payload } = payloadFormValues ?? initialValues;

      helpers.resetForm({
        values: {
          ...initialValues,
          payload,
        },
      });
    };

    sendMessage(method, message, callback, metadata, payloadType).catch(() => helpers.setSubmitting(false));
  };

  const handleCalculateGas = (values: FormValues, setFieldValue: SetFieldValue) => () =>
    calculateGas(method, api, values, alert, metadata, null, id).then((gasLimit) =>
      setFieldValue('gasLimit', gasLimit)
    );

  return (
    <Formik
      initialValues={initialValues}
      validateOnChange={false}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isValid, isSubmitting, setFieldValue }) => {
        const isDisabled = !isValid || isSubmitting;

        return (
          <Form data-testid="sendMessageForm" className={formStyles.largeForm}>
            <FormInput name="destination" label={isReply ? 'Message Id' : 'Destination'} />

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
              <Button
                type="submit"
                icon={sendMessageSVG}
                text={isReply ? 'Send reply' : 'Send message'}
                disabled={isDisabled}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export { MessageForm };
