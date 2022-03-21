import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ISubmittableResult } from '@polkadot/types/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Metadata } from '@gear-js/api';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import NumberFormat from 'react-number-format';
import { InitialValues } from './types';
import { FormPayload } from 'components/blocks/FormPayload/FormPayload';
import { RootState } from 'store/reducers';
import { EventTypes } from 'types/alerts';
import {
  AddAlert,
  sendMessageSuccessAction,
  sendMessageStartAction,
  sendMessageFailedAction,
} from 'store/actions/actions';
import { getPreformattedText, calculateGas } from 'helpers';
import MessageIllustration from 'assets/images/message.svg';
import { useApi } from 'hooks/useApi';
import { MetaParam, ParsedShape, parseMeta } from 'utils/meta-parser';
import { Schema } from './Schema';
import { PROGRAM_ERRORS } from 'consts';
import './MessageForm.scss';

type Props = {
  addressId: string;
  replyCode?: string;
  meta: Metadata | undefined;
  types: MetaParam | null;
};

const MessageForm: VFC<Props> = ({ addressId, replyCode, meta, types }) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const { account } = useSelector((state: RootState) => state.account);
  const [metaForm, setMetaForm] = useState<ParsedShape | null>();
  const [isManualInput, setIsManualInput] = useState(Boolean(!types));

  const [initialValues] = useState<InitialValues>({
    gasLimit: 20000000,
    value: 0,
    payload: types ? getPreformattedText(types) : '',
    addressId,
    fields: {},
  });

  useEffect(() => {
    if (types) {
      const parsedMeta = parseMeta(types);
      setMetaForm(parsedMeta);
      setIsManualInput(false);
    }
  }, [types]);

  const showSuccessAlert = (message: string) => {
    dispatch(AddAlert({ type: EventTypes.SUCCESS, message }));
  };

  const showErrorAlert = (message: string) => {
    dispatch(AddAlert({ type: EventTypes.ERROR, message }));
  };

  const handleFinalizedStatus = (events: EventRecord[], callback: () => void) => {
    events.forEach(({ event: { method } }) => {
      const isSuccess = method === 'DispatchMessageEnqueued';
      const isFailure = method === 'ExtrinsicFailed';

      if (isSuccess) {
        showSuccessAlert('Send message: Finalized');
        dispatch(sendMessageSuccessAction());
        callback();
      }

      if (isFailure) {
        showErrorAlert('Extrinsic Failed');
      }
    });
  };

  const handleSendStatus = ({ status, events }: ISubmittableResult, callback: () => void) => {
    const { isInBlock, isFinalized, isInvalid } = status;

    dispatch(sendMessageStartAction());

    if (isInBlock) {
      showSuccessAlert('Send message: In block');
    }

    if (isFinalized) {
      handleFinalizedStatus(events, callback);
    }

    if (isInvalid) {
      showErrorAlert(PROGRAM_ERRORS.INVALID_TRANSACTION);
      dispatch(sendMessageFailedAction(PROGRAM_ERRORS.INVALID_TRANSACTION));
    }
  };

  const showSendMessageError = (error: Error) => {
    showErrorAlert(`Send message: ${error}`);
    dispatch(sendMessageFailedAction(`${error}`));
  };

  const sendMessage = (values: InitialValues, resetForm: () => void) => {
    if (account) {
      const { address, meta: accountMeta } = account;
      const payload = isManualInput ? values.payload : values.fields;
      const method = replyCode ? 'reply' : 'message';

      const data = {
        gasLimit: values.gasLimit,
        value: values.value,
        payload,
      };

      const replyData = {
        replyToId: values.addressId,
        ...data,
      };

      const sendData = {
        destination: values.addressId,
        ...data,
      };

      if (replyCode) {
        api.reply.submit(replyData, meta);
      } else {
        api.message.submit(sendData, meta);
      }

      web3FromSource(accountMeta.source)
        .then(({ signer }) => {
          api[method].signAndSend(address, { signer }, (result: ISubmittableResult) =>
            handleSendStatus(result, resetForm)
          );
        })
        .catch(showSendMessageError);
    } else {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `WALLET NOT CONNECTED` }));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values, { resetForm }) => sendMessage(values, resetForm)}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form id="message-form">
          <div className="message-form--wrapper">
            <div className="message-form--col">
              <div className="message-form--info">
                <label htmlFor="destination" className="message-form__field">
                  {replyCode ? 'Message ID:' : 'Destination:'}
                </label>
                <div className="message-form__field-wrapper">
                  <Field
                    id="addressId"
                    name="addressId"
                    type="text"
                    className={clsx('', errors.addressId && touched.addressId && 'message-form__input-error')}
                  />
                  {errors.addressId && touched.addressId ? (
                    <div className="message-form__error">{errors.addressId}</div>
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
                <>
                  <button
                    className="message-form__button"
                    type="button"
                    onClick={() =>
                      calculateGas(
                        replyCode ? 'reply' : 'handle',
                        api,
                        isManualInput,
                        values,
                        setFieldValue,
                        dispatch,
                        meta,
                        null,
                        addressId,
                        replyCode ? replyCode : null
                      )
                    }
                  >
                    Calculate Gas
                  </button>
                  <button className="message-form__button" type="submit">
                    <>
                      <img src={MessageIllustration} alt="message" />
                      {replyCode ? 'Reply message' : 'Send message'}
                    </>
                  </button>
                </>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export { MessageForm };
