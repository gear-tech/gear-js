import React, { useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, FieldArray, Form, Formik } from 'formik';
import clsx from 'clsx';
import { SocketService } from 'services/SocketService';
import { MessageModel } from 'types/program';
import { sendMessageStartAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';
import { fileNameHandler } from 'helpers';
import MessageIllustration from 'assets/images/message.svg';
import { Schema } from './Schema';
import './MessageForm.scss';

type Props = {
  programHash: string;
  programName: string;
  socketService: SocketService;
  payloadType: object | string | null;
  handleClose: () => void;
};

export const MessageForm: VFC<Props> = ({ programHash, programName, socketService, handleClose, payloadType }) => {
  const getFieldsFromPayload = () => {
    const transformedPayloadType: any = [];

    const recursion = (object: any) => {
      for (const key in object) {
        if (typeof object[key] === 'string') {
          transformedPayloadType.push({
            [key]: object[key],
          });
        } else if (typeof object[key] === 'object') {
          recursion(object[key]);
        }
      }
    };

    if (payloadType && typeof payloadType === 'object') {
      recursion(payloadType);
    }
    return transformedPayloadType;
  };

  const dispatch = useDispatch();
  const { gas } = useSelector((state: RootState) => state.programs);
  const [isManualGas, setIsManualGas] = useState(false);

  const mapInitialValues = () => ({
    gasLimit: undefined,
    value: 20000,
    payload: '',
    destination: programHash,
  });

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
        const { additional, destination } = values;
        const pack = { ...values };
        if (additional) {
          delete pack.additional;
          pack.payload = JSON.stringify(transformPayloadVals(additional));
        }
        if (typeof gas !== 'number' && !isManualGas) {
          socketService.getGasSpent(destination, pack.payload);
        } else {
          pack.gasLimit = pack.gasLimit ?? gas ?? 0;
          socketService.sendMessageToProgram(pack);
          dispatch(sendMessageStartAction());
        }
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
              {(typeof payloadType !== 'object' || !payloadType) && (
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
                      placeholder={payloadType ? `${payloadType}` : 'null'}
                    />
                    {errors.payload && touched.payload ? (
                      <div className="message-form__error">{errors.payload}</div>
                    ) : null}
                  </div>
                </div>
              )}

              {((typeof gas === 'number' || isManualGas) && (
                <div className="message-form--info">
                  <label htmlFor="gasLimit" className="message-form__field">
                    Gas limit:
                  </label>
                  <div className="message-form__field-wrapper">
                    <Field
                      id="gasLimit"
                      name="gasLimit"
                      placeholder={gas}
                      type="number"
                      className={clsx('', errors.gasLimit && touched.gasLimit && 'message-form__input-error')}
                    />
                    {errors.gasLimit && touched.gasLimit ? (
                      <div className="message-form__error">{errors.gasLimit}</div>
                    ) : null}
                  </div>
                </div>
              )) ||
                null}
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
              {payloadType && typeof payloadType === 'object' && (
                <div className="message-form--payload">
                  <p>Payload</p>
                  <FieldArray
                    name="additional"
                    render={() => {
                      const additionalFields = getFieldsFromPayload();
                      console.log(additionalFields);
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
              )}
              <div className="message-form--btns">
                <button className="message-form__button" type="submit">
                  {(typeof gas !== 'number' && !isManualGas && <>Calculate Gas</>) || (
                    <>
                      <img src={MessageIllustration} alt="message" />
                      Send request
                    </>
                  )}
                </button>
                {(!isManualGas && typeof gas !== 'number' && (
                  <button className="message-form__button" type="button" onClick={() => setIsManualGas(true)}>
                    Manual gas input
                  </button>
                )) ||
                  null}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
