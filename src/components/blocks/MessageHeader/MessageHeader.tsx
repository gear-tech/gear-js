import React from "react";
import { useDispatch } from "react-redux";

import { sendMessageResetAction } from "store/actions/actions";

import { fileNameHandler } from 'helpers';

import ArrowBack from 'images/arrow_back.svg';
import ProgramIllustration from 'images/program_icon.svg';
import close from 'images/close.svg';

import './MessageHeader.scss'

type Props = {
    programName: string;
    isMessageForm: boolean
    handleClose: () => void; 
}

const MessageHeader = ({ programName, isMessageForm, handleClose }: Props) => {

    const dispatch = useDispatch();

    const handleArrowClick = () => {
        if (!isMessageForm) handleClose();
        else dispatch(sendMessageResetAction())
    }

    return (
        <div className={isMessageForm ? "message-header" : "message-header answer"}>
            <div className="message-header--info">
                <button
                    type="button" 
                    aria-label="arrowBack"
                    onClick={handleArrowClick}
                    className="message-header--info__back">
                    <img src={ArrowBack} alt="back"/>
                </button>
                <h2 className="message-header--info__text">{isMessageForm ? 'New request to' : 'Answer'}</h2>
                {
                    isMessageForm
                    &&
                    (
                        <>
                            <img src={ProgramIllustration} alt="program" className="message-header--info__icon"/>
                            <h2 className="message-header--info__filename">
                                { fileNameHandler(programName) }
                            </h2>
                        </>
                    )
                }
            </div>
            {/* eslint-disable react/button-has-type */}
            <button
                type="reset"
                aria-label="closeButton"
                form="message-form"
                className="message-header--info__close"
            >
                <img 
                    src={close} 
                    alt="close" 
                />
            </button>
            {/* eslint-disable react/button-has-type */}
        </div>
    )
}

export { MessageHeader }