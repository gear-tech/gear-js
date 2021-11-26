import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import NumberFormat from 'react-number-format';
import { getTypeStructure, Metadata, parseHexTypes } from '@gear-js/api';
import clsx from 'clsx';
import { SendMessageToProgram } from 'services/ApiService';
import { MessageModel } from 'types/program';
import { RootState } from 'store/reducers';
import { EventTypes } from 'types/events';
import { AddAlert } from 'store/actions/actions';
import { fileNameHandler } from 'helpers';
import MessageIllustration from 'assets/images/message.svg';
import { useApi } from '../../../../../../../hooks/useApi';
import { Schema } from './Schema';
import './MessageForm.scss';

type Props = {
  programHash: string;
  programName: string;
  meta: Metadata;
};

export const MessageForm: VFC<Props> = ({ programHash, programName, meta }) => {
  const [api] = useApi();
  const parsedMeta: Metadata = JSON.parse(meta as string);
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);
  const [ready, setReady] = useState(false);

  const [initialValues, setInitialValues] = useState({
    gasLimit: 20000,
    value: 0,
    payload: '',
    destination: programHash,
  });

  useEffect(() => {
    const displayedTypes = parseHexTypes(parsedMeta.types!);
    const inputType = getTypeStructure(parsedMeta.handle_input!, displayedTypes);
    console.log(initialValues.payload !== JSON.stringify(inputType, null, 4));
    if (Object.keys(displayedTypes).length && JSON.stringify(inputType, null, 4) !== initialValues.payload) {
      setInitialValues({ ...initialValues, payload: JSON.stringify(inputType, null, 4) });
    }
    setReady(true);
  }, [initialValues, setInitialValues, parsedMeta]);

  const calculateGas = async (values: any, setFieldValue: any) => {
    if (values.payload.length === 0) {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `Error: payload can't be empty` }));
      return;
    }

    try {
      const estimatedGas = await api?.program.getGasSpent(programHash, values.payload, meta.handle_input, meta);
      dispatch(AddAlert({ type: EventTypes.INFO, message: `Estimated gas ${estimatedGas}` }));
      setFieldValue('gasLimit', Number(`${estimatedGas}`));
    } catch (error) {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `${error}` }));
      console.error(error);
    }
  };

  if (ready) {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={Schema}
        validateOnBlur
        onSubmit={(values: MessageModel, { resetForm }) => {
          if (currentAccount) {
            SendMessageToProgram(api, currentAccount, values, dispatch, () => {
              resetForm();
            });
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
                  <span>File:</span>
                  <span>{fileNameHandler(programName)}</span>
                </div>
                <div className="message-form--info">
                  <label htmlFor="destination" className="message-form__field">
                    Destination:
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
                  <div className="message-form__field-wrapper">
                    <Field
                      id="payload"
                      name="payload"
                      as="textarea"
                      type="text"
                      className={clsx('', errors.payload && touched.payload && 'message-form__input-error')}
                      placeholder="// your payload here ..."
                      rows={15}
                    />
                    {errors.payload && touched.payload ? (
                      <div className="message-form__error">{errors.payload}</div>
                    ) : null}
                  </div>
                </div>

                <div className="message-form--info">
                  <label htmlFor="gasLimit" className="message-form__field">
                    Gas limit:
                  </label>
                  <div className="message-form__field-wrapper">
                    <NumberFormat
                      name="gasLimit"
                      placeholder="20000"
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
                      onClick={() => {
                        calculateGas(values, setFieldValue);
                      }}
                    >
                      Calculate Gas
                    </button>
                    <button className="message-form__button" type="submit">
                      <>
                        <img src={MessageIllustration} alt="message" />
                        Send request
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
  }

  return null;
};
