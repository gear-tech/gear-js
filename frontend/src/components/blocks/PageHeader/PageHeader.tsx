import React from "react";
import { useDispatch } from "react-redux";

import { PAGE_TYPES } from "consts";

import { sendMessageResetAction } from "store/actions/actions";

import { fileNameHandler } from 'helpers';

import ArrowBack from 'images/arrow_back.svg';
import ProgramIllustration from 'images/program_icon.svg';
import close from 'images/close.svg';

import './PageHeader.scss'

type Props = {
    programName: string;
    pageType: string;
    handleClose: () => void; 
}

const PageHeader = ({ programName, pageType, handleClose }: Props) => {

    const dispatch = useDispatch();

    const handleArrowClick = () => {
        if (pageType === PAGE_TYPES.MESSAGE_FORM_PAGE || pageType === PAGE_TYPES.EDITOR_PAGE) {
            handleClose();
        } else if (pageType === PAGE_TYPES.ANSWER_PAGE) {
            dispatch(sendMessageResetAction());
        }
    }

    let headInscription = 'Answer';
    if (pageType === PAGE_TYPES.MESSAGE_FORM_PAGE) {
        headInscription = 'New request to';
    } else if (pageType === PAGE_TYPES.EDITOR_PAGE) {
        headInscription = 'Edit code';
    }

    return (
        <div className={pageType ? "message-header" : "message-header answer"}>
            <div className="message-header--info">
                <button
                    type="button" 
                    aria-label="arrowBack"
                    onClick={handleArrowClick}
                    className="message-header--info__back">
                    <img src={ArrowBack} alt="back"/>
                </button>
                <h2 className="message-header--info__text">{headInscription}</h2>
                {
                    pageType !== PAGE_TYPES.ANSWER_PAGE
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

export { PageHeader }