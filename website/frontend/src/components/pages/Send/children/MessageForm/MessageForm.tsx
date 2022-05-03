import { useEffect, useRef, useState, useMemo, VFC } from 'react';
import { useAlert } from 'react-alert';
import clsx from 'clsx';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import NumberFormat from 'react-number-format';
import { Metadata } from '@gear-js/api';
import { sendMessage } from 'services/ApiService';
import { InitialValues } from './types';
import { FormPayload } from 'components/blocks/FormPayload/FormPayload';
import { getPreformattedText, calculateGas } from 'helpers';
import MessageIllustration from 'assets/images/message.svg';
import { useAccount, useApi, useLoading } from 'hooks';
import { MetaItem, MetaFieldsStruct, parseMeta, prepareToSend, PreparedMetaData } from 'components/MetaFields';
import { Schema } from './Schema';
import { PayloadType } from './children/PayloadType';
import './MessageForm.scss';

type Props = {
  id: string;
  meta?: Metadata;
  types: MetaItem | null;
  replyErrorCode?: string;
};

export const MessageForm: VFC<Props> = ({ id, meta, types, replyErrorCode }) => {
  const { api } = useApi();
  const alert = useAlert();
  const { enableLoading, disableLoading } = useLoading();
  const { account: currentAccount } = useAccount();
  const [metaForm, setMetaForm] = useState<MetaFieldsStruct | null>();
  const [isManualInput, setIsManualInput] = useState(Boolean(!types));

  const initialValues = useRef<InitialValues>({
    gasLimit: 20000000,
    value: 0,
    payload: types ? getPreformattedText(types) : '',
    payloadType: 'Bytes',
    destination: id,
    __root: null,
  });

  const isReply = !!replyErrorCode;

  const isMeta = useMemo(() => meta && Object.keys(meta).length > 0, [meta]);

  const handleSubmit = (values: InitialValues, { resetForm }: FormikHelpers<InitialValues>) => {
    // TODO: find out how to improve this one
    if (currentAccount) {
      const payloadType = isMeta ? void 0 : values.payloadType;

      const message = {
        replyToId: values.destination,
        destination: values.destination,
        gasLimit: values.gasLimit.toString(),
        value: values.value.toString(),
        payload: isManualInput ? values.payload : prepareToSend(values.__root as PreparedMetaData),
      };

      sendMessage(
        isReply ? api.reply : api.message,
        currentAccount,
        message,
        enableLoading,
        disableLoading,
        alert,
        resetForm,
        meta,
        payloadType
      );
    } else {
      alert.error(`WALLET NOT CONNECTED`);
    }
  };

  useEffect(() => {
    if (types) {
      const parsedMeta = parseMeta(types);
      setMetaForm(parsedMeta);
      if (parsedMeta && parsedMeta.__root && parsedMeta.__values) {
        setIsManualInput(false);
        initialValues.current.__root = parsedMeta.__values;
      }
    }
  }, [types, initialValues]);

  return (
    <Formik
      initialValues={initialValues.current}
      validationSchema={Schema}
      validateOnBlur
      enableReinitialize
      onSubmit={handleSubmit}
    >
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
                  {errors.destination && touched.destination ? (
                    <div className="message-form__error">{errors.destination}</div>
                  ) : null}
                </div>
              </div>

              <div className="message-form--info">
                <label htmlFor="payload" className="message-form__field">
                  Payload:
                </label>
                <FormPayload
                  className="message-form__field-wrapper"
                  isManualInput={isManualInput}
                  setIsManualInput={setIsManualInput}
                  formData={metaForm}
                />
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
                      isManualInput,
                      values,
                      setFieldValue,
                      alert,
                      meta,
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
