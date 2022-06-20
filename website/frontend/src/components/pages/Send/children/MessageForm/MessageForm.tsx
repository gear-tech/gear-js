import { useMemo, VFC, useRef } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { Metadata } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import { Schema } from './Schema';
import { FormValues, SetFieldValue } from './types';

import { calculateGas } from 'helpers';
import { useAccount, useApi, useAlert } from 'hooks';
import { sendMessage } from 'services/ApiService';
import sendMessageSVG from 'assets/images/message.svg';
import { FormInput, FormPayload, FormPayloadType, FormNumberFormat, formStyles } from 'components/common/Form';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';

type Props = {
  id: string;
  metadata?: Metadata;
  replyErrorCode?: string;
};

export const MessageForm: VFC<Props> = ({ id, metadata, replyErrorCode }) => {
  const { api } = useApi();
  const alert = useAlert();
  const { account: currentAccount } = useAccount();

  const initialValues = useRef<FormValues>({
    value: 0,
    payload: '',
    gasLimit: 20000000,
    payloadType: 'Bytes',
    destination: id,
  });

  const isReply = !!replyErrorCode;
  const isMeta = useMemo(() => metadata && Object.keys(metadata).length > 0, [metadata]);

  const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    if (!currentAccount) {
      alert.error(`WALLET NOT CONNECTED`);
      return;
    }

    const apiMethod = isReply ? api.reply : api.message;
    const payloadType = isMeta ? void 0 : values.payloadType;

    const message = {
      value: values.value.toString(),
      payload: getSubmitPayload(values.payload),
      gasLimit: values.gasLimit.toString(),
      replyToId: values.destination,
      destination: values.destination,
    };

    sendMessage(apiMethod, currentAccount, message, alert, resetForm, metadata, payloadType);
  };

  const handleCalculateGas = (values: FormValues, setFieldValue: SetFieldValue) => () => {
    const method = isReply ? 'reply' : 'handle';

    calculateGas(method, api, values, alert, metadata, null, id, replyErrorCode).then((gasLimit) =>
      setFieldValue('gasLimit', gasLimit)
    );
  };

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, metadata?.handle_input), [metadata]);

  return (
    <Formik initialValues={initialValues.current} validateOnBlur validationSchema={Schema} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form className={formStyles.largeForm}>
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
