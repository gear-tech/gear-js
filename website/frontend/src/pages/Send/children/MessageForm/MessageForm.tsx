import { useMemo, useRef } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { Metadata } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import { Schema } from './Schema';
import { FormValues, SetFieldValue } from './types';

import { calculateGas } from 'helpers';
import { useApi, useAlert, useSendMessage } from 'hooks';
import { FormInput, FormPayload, FormPayloadType, FormNumberFormat, formStyles } from 'components/common/Form';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';
import sendMessageSVG from 'assets/images/message.svg';

type Props = {
  id: string;
  isReply: boolean;
  metadata?: Metadata;
  replyErrorCode?: string;
};

const MessageForm = ({ id, isReply, metadata, replyErrorCode }: Props) => {
  const { api } = useApi();
  const alert = useAlert();
  const sendMessage = useSendMessage();

  const initialValues = useRef<FormValues>({
    value: 0,
    payload: '',
    gasLimit: 20000000,
    payloadType: 'Bytes',
    destination: id,
  });

  const isMeta = useMemo(() => metadata && Object.keys(metadata).length > 0, [metadata]);

  const method = isReply ? 'reply' : 'handle';

  const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const payloadType = isMeta ? void 0 : values.payloadType;

    const message = {
      value: values.value.toString(),
      payload: getSubmitPayload(values.payload),
      gasLimit: values.gasLimit.toString(),
      replyToId: values.destination,
      destination: values.destination,
    };

    sendMessage(method, message, resetForm, metadata, payloadType);
  };

  const handleCalculateGas = (values: FormValues, setFieldValue: SetFieldValue) => () =>
    calculateGas(method, api, values, alert, metadata, null, id, replyErrorCode).then((gasLimit) =>
      setFieldValue('gasLimit', gasLimit)
    );

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, metadata?.handle_input), [metadata]);

  return (
    <Formik initialValues={initialValues.current} validateOnBlur validationSchema={Schema} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form data-testid="sendMessageForm" className={formStyles.largeForm}>
          <FormInput name="destination" label={isReply ? 'Message Id' : 'Destination'} />

          <FormPayload name="payload" label="Payload" values={payloadFormValues} />

          {!isMeta && <FormPayloadType name="payloadType" label="Payload type" />}

          <FormNumberFormat
            name="gasLimit"
            label="Gas limit"
            placeholder="20,000,000"
            thousandSeparator
            allowNegative={false}
          />

          <FormInput type="number" name="value" label="Value" placeholder="20000" />

          <div className={formStyles.formButtons}>
            <Button text="Calculate Gas" onClick={handleCalculateGas(values, setFieldValue)} />
            <Button type="submit" icon={sendMessageSVG} text={isReply ? 'Send reply' : 'Send message'} />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export { MessageForm };
