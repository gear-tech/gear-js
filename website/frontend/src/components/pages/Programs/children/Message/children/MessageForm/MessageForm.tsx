import React, { VFC } from 'react';
import { useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import clsx from 'clsx';
import { SendMessageToProgram } from 'services/ApiService';
import { MessageModel } from 'types/program';
import { sendMessageStartAction } from 'store/actions/actions';
import { fileNameHandler } from 'helpers';
import MessageIllustration from 'assets/images/message.svg';
import { GEAR_STORAGE_KEY, RPC_METHODS } from 'consts';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { useAlert } from 'react-alert';
import { useApi } from '../../../../../../../hooks/useApi';
import { Schema } from './Schema';
import './MessageForm.scss';

type Props = {
  programHash: string;
  programName: string;
};

export const MessageForm: VFC<Props> = ({ programHash, programName }) => {
  const [api] = useApi();
  const alert = useAlert();

  const dispatch = useDispatch();

  const initialValues = {
    gasLimit: 20000,
    value: 0,
    payload: '',
    destination: programHash,
  };

  const calculateGas = async (values: any, setFieldValue: any) => {
    const apiRequest = new ServerRPCRequestService();

    if (values.payload.length === 0) {
      alert.error(`Error: payload can't be empty`);
      return;
    }

    try {
      const {
        result: { meta },
      } = await apiRequest.getResource(
        RPC_METHODS.GET_METADATA,
        {
          programId: programHash,
        },
        { Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}` }
      );

      const estimatedGas = await api?.program.getGasSpent(programHash, values.payload, meta.input, meta);
      alert.info(`Estimated gas ${estimatedGas}`);
      setFieldValue('gasLimit', Number(`${estimatedGas}`));
    } catch (error) {
      alert.error(`${error}`);
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values: MessageModel, { resetForm }) => {
        SendMessageToProgram(api, values, dispatch, alert);
        dispatch(sendMessageStartAction());
        resetForm();
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
                    rows={5}
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
                  <Field
                    id="gasLimit"
                    name="gasLimit"
                    type="number"
                    className={clsx('', errors.gasLimit && touched.gasLimit && 'message-form__input-error')}
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
};
