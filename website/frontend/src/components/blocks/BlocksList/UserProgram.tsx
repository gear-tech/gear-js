import React from "react";
import { useDispatch } from "react-redux";

import { ProgramModel } from "types/program";

import { getProgramAction } from 'store/actions/actions';

import { fileNameHandler, formatDate } from 'helpers';

import RefreshIllustration from 'images/refresh.svg';
import MessageIllustration from 'images/message.svg';
import UploadIcon from 'images/upload.svg';

type Props = {
    program: ProgramModel;
    handleOpenForm: (programHash: string, programName?: string, isMessage?: boolean) => void;
}

const UserProgram = ({ program, handleOpenForm }: Props) => {

    const dispatch = useDispatch();

    const handleRefreshProgram = (programHash: string) => {
        dispatch(getProgramAction(programHash))
    }
    
    return (
        <div className="programs-list__item" key={program.hash}>
            <span className="programs-list__number">{program.programNumber}</span>
            <div className="program-wrapper">
                <div className="program-wrapper__name">
                <span className="programs-list__name">{program.name && fileNameHandler(program.name)}</span>
                </div>
                <div className="program-wrapper__data">
                <div className="programs-list__info">
                    Number of calls:<span className="programs-list__info-data">{program.callCount}</span>
                </div>
                <div className="programs-list__info">
                    Uploaded at:<span className="programs-list__info-data">{program.uploadedAt && formatDate(program.uploadedAt)}</span>
                </div>
                </div>
            </div>
            <div className="programs-list--btns">
                <button 
                    className="programs-list__message-btn" 
                    type="button" 
                    aria-label="refresh"
                    onClick={() => handleOpenForm(program.hash, program.name, true)}
                >
                    <img src={MessageIllustration} alt="message" />
                </button>
                <button 
                    className="programs-list__refresh-btn" 
                    type="button" 
                    aria-label="refresh"
                    onClick={() => handleRefreshProgram(program.hash)}
                >
                    <img src={RefreshIllustration} alt="refresh" />
                </button>
                <button className="all-programs--item__upload" type="button" onClick={() => handleOpenForm(program.hash, program.name)}>
                    <img src={UploadIcon} alt="upload-program" />
                </button>
            </div>
        </div>
    )
}

export { UserProgram };