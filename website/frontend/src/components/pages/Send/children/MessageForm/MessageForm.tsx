import { useMemo, VFC, useRef } from 'react';
import clsx from 'clsx';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import NumberFormat from 'react-number-format';
import { createPayloadTypeStructure, decodeHexTypes, Metadata } from '@gear-js/api';

import { Schema } from './Schema';
import { FormValues } from './types';
import { PayloadType } from './children/PayloadType';

import { calculateGas } from 'helpers';
import { useAccount, useApi, useAlert } from 'hooks';
import { sendMessage } from 'services/ApiService';
import MessageIllustration from 'assets/images/message.svg';
import { FormPayload } from 'components/common/FormPayload';
import { preparePaylaod } from 'components/common/FormPayload/helpers';
import './MessageForm.scss';

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

    const payload = preparePaylaod(values.payload);
    const apiMethod = isReply ? api.reply : api.message;
    const payloadType = isMeta ? void 0 : values.payloadType;

    const message = {
      value: values.value.toString(),
      payload,
      gasLimit: values.gasLimit.toString(),
      replyToId: values.destination,
      destination: values.destination,
    };

    sendMessage(apiMethod, currentAccount, message, alert, resetForm, metadata, payloadType);
  };

  const typeStructures = useMemo(() => {
    if (metadata?.types && metadata?.handle_input) {
      const decodedTypes = decodeHexTypes(metadata.types);

      return {
        manual: createPayloadTypeStructure(metadata.handle_input, decodedTypes, true),
        payload: createPayloadTypeStructure(metadata.handle_input, decodedTypes),
      };
    }
  }, [metadata]);

  return (
    <Formik initialValues={initialValues.current} validateOnBlur validationSchema={Schema} onSubmit={handleSubmit}>
      {({ errors, touched, values, setFieldValue }) => (
        <Form id="message-form">
          <div className="message-form--wrapper">
            <div className="message-form--col">
              <div className="message-form--info">
                <label htmlFor="destination" className="message-form__field">
                  {isReply ? 'Message Id:' : 'Destination:'}
                </label>
                <div className="message-form__field-wrapper">
                  <Field
                    id="destination"
                    name="destination"
                    type="text"
                    className={clsx('', errors.destination && touched.destination && 'message-form__input-error')}
                  />
                  {errors.destination && touched.destination && (
                    <div className="message-form__error">{errors.destination}</div>
                  )}
                </div>
              </div>

              <div className="message-form--info">
                <label htmlFor="payload" className="message-form__field">
                  Payload:
                </label>
                <FormPayload name="payload" typeStructures={typeStructures} />
              </div>

              {!isMeta && (
                <div className="message-form--info">
                  <label htmlFor="payloadType" className="message-form__field">
                    Payload type:
                  </label>
                  <PayloadType />
                </div>
              )}

              <div className="message-form--info">
                <label htmlFor="gasLimit" className="message-form__field">
                  Gas limit:
                </label>
                <div className="message-form__field-wrapper">
                  <NumberFormat
                    name="gasLimit"
                    placeholder="20,000,000"
                    value={values.gasLimit}
                    thousandSeparator
                    allowNegative={false}
                    className={clsx('', errors.gasLimit && touched.gasLimit && 'message-form__input-error')}
                    onValueChange={(val) => {
                      const { floatValue } = val;
                      setFieldValue('gasLimit', floatValue);
                    }}
                  />
                  {errors.gasLimit && touched.gasLimit ? (
                    <div className="message-form__error">{errors.gasLimit}</div>
                  ) : null}
                </div>
              </div>

              <div className="message-form--info">
                <label htmlFor="value" className="message-form__field">
                  Value:
                </label>
                <div className="message-form__field-wrapper">
                  <Field
                    id="value"
                    name="value"
                    placeholder="20000"
                    type="number"
                    className={clsx('', errors.value && touched.value && 'message-form__input-error')}
                  />
                  {errors.value && touched.value ? <div className="message-form__error">{errors.value}</div> : null}
                </div>
              </div>
              <div className="message-form--btns">
                <button
                  className="message-form__button"
                  type="button"
                  onClick={() => {
                    calculateGas(
                      isReply ? 'reply' : 'handle',
                      api,
                      values,
                      setFieldValue,
                      alert,
                      metadata,
                      null,
                      id,
                      replyErrorCode
                    );
                  }}
                >
                  Calculate Gas
                </button>
                <button className="message-form__button" type="submit">
                  <img src={MessageIllustration} alt="message" />
                  {isReply ? 'Send reply' : 'Send message'}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
