import React, { VFC } from 'react';
import { useDispatch } from 'react-redux';
// import { Field, FieldArray, Form, Formik } from 'formik';
import { Field, Form, Formik } from 'formik';
import clsx from 'clsx';
import { SendMessageToProgram } from 'services/ApiService';
import { MessageModel } from 'types/program';
import { sendMessageStartAction } from 'store/actions/actions';
import { fileNameHandler } from 'helpers';
import MessageIllustration from 'assets/images/message.svg';
import { useAlert } from 'react-alert';
import { useApi } from '../../../../../../../hooks/useApi';
import { Schema } from './Schema';
import './MessageForm.scss';

type Props = {
  programHash: string;
  programName: string;
  payloadType: object | string | null;
  handleClose: () => void;
};

// todo improve form logic, refactor
export const MessageForm: VFC<Props> = ({ programHash, programName, handleClose }) => {
  const [api] = useApi();
  const alert = useAlert();

  // const getFieldsFromPayload = () => {
  //   const transformedPayloadType: any = [];

  //   const recursion = (object: any) => {
  //     for (const key in object) {
  //       if (typeof object[key] === 'string') {
  //         transformedPayloadType.push({
  //           [key]: object[key],
  //         });
  //       } else if (typeof object[key] === 'object') {
  //         recursion(object[key]);
  //       }
  //     }
  //   };

  //   if (payloadType && typeof payloadType === 'object') {
  //     recursion(payloadType);
  //   }
  //   return transformedPayloadType;
  // };

  const dispatch = useDispatch();

  const mapInitialValues = () => ({
    gasLimit: 20000,
    value: 0,
    payload: '',
    destination: programHash,
  });

  const calculateGas = async () => {
    console.log('click');
  };

  const transformPayloadVals = (data: any) => {
    const object = {};
    if (data && data.length) {
      data.forEach((element: any) => {
        const key = Object.keys(element)[0];

        // @ts-ignore
        object[key] = element[key];
      });
    }
    return object;
  };

  return (
    <Formik
      initialValues={mapInitialValues()}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values: MessageModel) => {
        const { additional } = values;
        const pack = { ...values };
        if (additional) {
          delete pack.additional;
          pack.payload = JSON.stringify(transformPayloadVals(additional));
        }
        SendMessageToProgram(api, pack, dispatch, alert);
        dispatch(sendMessageStartAction());
      }}
      onReset={handleClose}
    >
      {({ errors, touched }) => (
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
                    type="text"
                    className={clsx('', errors.payload && touched.payload && 'message-form__input-error')}
                    placeholder="null"
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
              {/* {payloadType && typeof payloadType === 'object' && (
                <div className="message-form--payload">
                  <p>Payload</p>
                  <FieldArray
                    name="additional"
                    render={() => {
                      const additionalFields = getFieldsFromPayload();
                      return (
                        <>
                          {(additionalFields &&
                            additionalFields.length &&
                            additionalFields.map((item: any, index: number) => (
                              <div className="message-form--info">
                                <label htmlFor="payload" className="message-form__field">
                                  {Object.keys(item)[0]}:
                                </label>
                                <Field
                                  id={`additional.${index}.${Object.keys(item)[0]}`}
                                  name={`additional.${index}.${Object.keys(item)[0]}`}
                                  type="text"
                                  placeholder={item[Object.keys(item)[0]]}
                                />
                              </div>
                            ))) ||
                            null}
                        </>
                      );
                    }}
                  />
                </div>
              )} */}
              <div className="message-form--btns">
                <>
                  <button className="message-form__button" type="button" onClick={calculateGas}>
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
