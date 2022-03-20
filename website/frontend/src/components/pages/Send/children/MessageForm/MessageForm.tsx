import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Metadata } from '@gear-js/api';
import clsx from 'clsx';
import { Field, Form, Formik } from 'formik';
import NumberFormat from 'react-number-format';
import { InitialValues } from './types';
import { FormPayload } from 'components/blocks/FormPayload/FormPayload';
import { RootState } from 'store/reducers';
import { EventTypes } from 'types/alerts';
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

const MessageForm: VFC<Props> = ({ addressId, replyCode, meta, types }) => {
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

  const showError = (error: string) => {
    dispatchAlert(`Send message: ${error}`, false);
    dispatch(sendMessageFailedAction(`${error}`));
  };

  const sendMessage = (account: UserAccount, sendData: any, resetForm: () => void) => {
    api[replyCode ? 'reply' : 'message'].submit(sendData, meta);

    web3FromSource(account.meta.source)
      .then((injector: any) => {
        api[replyCode ? 'reply' : 'message'].signAndSend(
          account.address,
          { signer: injector.signer },
          (data: ISubmittableResult) => showStatus(data, resetForm)
        );
      })
      .catch(showError);
  };

  const handleSubmit = (values: InitialValues, resetForm: () => void) => {
    if (currentAccount) {
      const payload = isManualInput ? values.payload : values.fields;
      const prop = replyCode ? 'replyToId' : 'destination';

      const data = {
        [prop]: values.addressId,
        gasLimit: values.gasLimit,
        value: values.value,
        payload,
      };

      sendMessage(currentAccount, data, resetForm);
    } else {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `WALLET NOT CONNECTED` }));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
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
