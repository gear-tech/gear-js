import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { SocketService } from 'services/SocketService';
import { MessageModel } from 'types/program';
import { sendMessageStartAction } from 'store/actions/actions';

import { fileNameHandler } from 'helpers';

import MessageIllustration from 'images/message.svg';

import { Schema } from './Schema';

import './MessageForm.scss'

type Props = {
    programHash: string;
    programName: string;
    socketService: SocketService;  
    handleClose: () => void;
}

const MessageForm = ({ programHash, programName, socketService, handleClose }: Props) => {

    const [isFormFilled, setIsFormFilled] = useState(false);

    const dispatch = useDispatch();

    const mapInitialValues = () => ({
        gasLimit: 20000,
        value: 20000,
        payload: "",
        destination: programHash
    })

    const handleInputChange = (errors: any) => {
        setIsFormFilled(Object.keys(errors).length === 0)
    }

    return (
        <Formik
            initialValues={mapInitialValues()}
            validationSchema={Schema}
            validateOnBlur
            onSubmit={(
                values: MessageModel,
            ) => {
                socketService.sendMessageToProgram(values);
                dispatch(sendMessageStartAction());
            }}
            onReset={handleClose}
        >
        {({ errors, touched, setFieldValue }) => (
            <Form id="message-form">
                <div className="message-form--wrapper">
                    <div className="message-form--col">
                        <div className="message-form--info">
                            <span>File:</span>
                            <span>{fileNameHandler(programName)}</span>
                        </div>
                        <div className="message-form--info">
                            <label htmlFor="destination"  className="message-form__field">Destination:</label>
                            <div className="message-form__field-wrapper">
                                <Field 
                                    id="destination" 
                                    name="destination" 
                                    type="text"
                                    className={errors.destination && touched.destination ? "message-form__input-error" : ""}
                                    onChange={(e: React.ChangeEvent<any>) => {
                                        setFieldValue(e.target.name, e.target.value)
                                        handleInputChange(errors)
                                    }}
                                />
                                {errors.destination && touched.destination ? <div className="message-form__error">{errors.destination}</div> : null}
                            </div>
                        </div>
                        <div className="message-form--info">
                            <label htmlFor="payload" className="message-form__field">Payload:</label>
                            <div className="message-form__field-wrapper">
                                <Field 
                                    id="payload" 
                                    name="payload" 
                                    type="text"
                                    className={errors.payload && touched.payload ? "message-form__input-error" : ""}
                                    onChange={(e: React.ChangeEvent<any>) => {
                                        setFieldValue(e.target.name, e.target.value)
                                        handleInputChange(errors)
                                    }}
                                />
                                {errors.payload && touched.payload ? <div className="message-form__error">{errors.payload}</div> : null}
                            </div>
                        </div>

                        <div className="message-form--info">
                            <label htmlFor="gasLimit" className="message-form__field">Gas limit:</label>
                            <div className="message-form__field-wrapper">
                                <Field 
                                    id="gasLimit" 
                                    name="gasLimit" 
                                    placeholder="20000" 
                                    type="number"
                                    className={errors.gasLimit && touched.gasLimit ? "message-form__input-error" : ""}
                                    onChange={(e: React.ChangeEvent<any>) => {
                                        setFieldValue(e.target.name, e.target.value)
                                        handleInputChange(errors)
                                    }}
                                />
                                {errors.gasLimit && touched.gasLimit ? <div className="message-form__error">{errors.gasLimit}</div> : null}
                            </div>
                        </div>
                        <div className="message-form--info">
                            <label htmlFor="value" className="message-form__field">Value:</label>
                            <div className="message-form__field-wrapper">
                                <Field 
                                    id="value" 
                                    name="value" 
                                    placeholder="20000" 
                                    type="number"
                                    className={errors.value && touched.value ? "message-form__input-error" : ""}
                                    onChange={(e: React.ChangeEvent<any>) => {
                                        setFieldValue(e.target.name, e.target.value)
                                        handleInputChange(errors)
                                    }}
                                />
                                {errors.value && touched.value ? <div className="message-form__error">{errors.value}</div> : null}
                            </div>
                        </div>
                        <button
                            className={isFormFilled ? "message-form__button" : "message-form__button disabled"}
                            type="submit"
                            disabled={!isFormFilled}>
                                <img src={MessageIllustration} alt="message"/>
                                Send request
                        </button>
                    </div>
                    <div className="message-form--col">
                        <div className="message-form--switch">
                            <label htmlFor="hashFile" className="switch">
                                <Field 
                                    id="hashFile" 
                                    name="hashFile" 
                                    placeholder="20000" 
                                    type="checkbox"
                                />
                                <span className="slider round"/>
                            </label>
                            <div className="message-form--switch__name">Hash a file</div>
                        </div>
                        <div className="message-form--switch">
                            <label htmlFor="fileUpload" className="switch">
                                <Field 
                                    id="fileUpload" 
                                    name="fileUpload" 
                                    type="checkbox"
                                />
                                <span className="slider round"/>
                            </label>
                            <div className="message-form--switch__name">File upload</div>
                        </div>
                    </div>
                </div>
            </Form>
        )}
        </Formik>
    )
}

export { MessageForm };