import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Metadata } from '@gear-js/api';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import NumberFormat from 'react-number-format';
import { InitialValues, SendMessage } from './types';
import { FormPayload } from 'components/blocks/FormPayload/FormPayload';
import { RootState } from 'store/reducers';
import { EventTypes } from 'types/alerts';
import { SetFieldValue } from 'types/common';
import { UserAccount } from 'types/account';
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

export const MessageForm: VFC<Props> = ({ addressId, replyCode, meta, types }) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);
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

  const handleCalculateGas = (values: InitialValues, setFieldValue: SetFieldValue) => {
    if (replyCode) {
      calculateGas('reply', api, isManualInput, values, setFieldValue, dispatch, meta, null, addressId, replyCode);
    } else {
      calculateGas('handle', api, isManualInput, values, setFieldValue, dispatch, meta, null, addressId);
    }
  };

  const dispatchAlert = (text: string, isSuccess: boolean) => {
    dispatch(
      AddAlert({
        type: isSuccess ? EventTypes.SUCCESS : EventTypes.ERROR,
        message: text,
      })
    );
  };

  const showStatus = (data: ISubmittableResult, resetForm: () => void) => {
    dispatch(sendMessageStartAction());

    if (data.status.isInBlock) {
      dispatchAlert('Send message: In block', true);
    }

    if (data.status.isFinalized) {
      data.events.forEach((event: any) => {
        const { method } = event.event;

        if (method === 'DispatchMessageEnqueued') {
          dispatchAlert('Send message: Finalized', true);
          dispatch(sendMessageSuccessAction());
          resetForm();
        }

        if (method === 'ExtrinsicFailed') {
          dispatchAlert('Extrinsic Failed', false);
        }
      });
    }

    if (data.status.isInvalid) {
      dispatchAlert(PROGRAM_ERRORS.INVALID_TRANSACTION, false);
      dispatch(sendMessageFailedAction(PROGRAM_ERRORS.INVALID_TRANSACTION));
    }
  };

  const showError = (error: any) => {
    dispatchAlert(`Send message: ${error}`, false);
    dispatch(sendMessageFailedAction(`${error}`));
  };

  const sendMessageToProgram = async (account: UserAccount, message: SendMessage, resetForm: () => void) => {
    const injector = await web3FromSource(account.meta.source);
    const sendData = {
      destination: message.addressId,
      gasLimit: message.gasLimit,
      value: message.value,
      payload: message.payload,
    };

    try {
      await api.message.submit(sendData, meta);
      await api.message.signAndSend(account.address, { signer: injector.signer }, (data: any) =>
        showStatus(data, resetForm)
      );
    } catch (error) {
      showError(error);
    }
  };

  const replyMessageToProgram = async (account: UserAccount, message: SendMessage, resetForm: () => void) => {
    const injector = await web3FromSource(account.meta.source);
    const replyData = {
      toId: message.addressId,
      gasLimit: message.gasLimit,
      value: message.value,
      payload: message.payload,
    };

    try {
      await api.reply.submitReply(replyData, meta);
      await api.reply.signAndSend(account.address, { signer: injector.signer }, (data: any) =>
        showStatus(data, resetForm)
      );
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values, { resetForm }) => {
        if (currentAccount) {
          const payload = isManualInput ? values.payload : values.fields;

          const message: SendMessage = {
            addressId: values.addressId,
            gasLimit: values.gasLimit.toString(),
            value: values.value.toString(),
            payload,
          };

          if (api) {
            if (replyCode) {
              replyMessageToProgram(currentAccount, message, resetForm);
            } else {
              sendMessageToProgram(currentAccount, message, resetForm);
            }
          }
        } else {
          dispatch(AddAlert({ type: EventTypes.ERROR, message: `WALLET NOT CONNECTED` }));
        }
      }}
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
                    onClick={() => handleCalculateGas(values, setFieldValue)}
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
