import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import { SocketService } from 'services/SocketService';
import { RootState } from 'store/reducers';
import { sendMessageResetAction } from 'store/actions/actions';
import StatusPanel from 'components/blocks/StatusPanel';
import { MessageForm } from "components/blocks/MessageForm";
import { MessageStatus } from "components/blocks/MessageStatus";
import { PageHeader } from "components/blocks/PageHeader";

import './Message.scss'
import { PAGE_TYPES } from "consts";

type Props = {
    programHash: string;
    programName: string;
    socketService: SocketService;  
    handleClose: () => void;
}

const Message = ({ programHash, programName, socketService, handleClose }: Props) => {

    const dispatch = useDispatch();

    const { messageSendingError, messageSendingStatus } = useSelector((state: RootState) => state.programs);

    let statusPanelText: string | null = null;
    const isMessageForm = messageSendingStatus == null || typeof messageSendingStatus === "string";

    const pageType = isMessageForm ? PAGE_TYPES.MESSAGE_FORM_PAGE : PAGE_TYPES.ANSWER_PAGE

    if (messageSendingError) {
        statusPanelText = messageSendingError
    } else if (messageSendingStatus && typeof messageSendingStatus === "string") {
        statusPanelText = messageSendingStatus;
    } 

    return (
        <div className="message-form">  
            <PageHeader programName={programName} handleClose={handleClose} pageType={pageType}/>
            {
                isMessageForm
                &&
                <MessageForm programHash={programHash} programName={programName} socketService={socketService} handleClose={handleClose}/>
            }
            {
                messageSendingStatus && typeof messageSendingStatus !== "string"
                &&
                <MessageStatus data={messageSendingStatus.data}/>
            }
            <MessageStatus data="Pong"/>
            {statusPanelText && <StatusPanel onClose={() => {
                dispatch(sendMessageResetAction())
            }} statusPanelText={statusPanelText} isError={!!messageSendingError}/>}
        </div>
    )
}

export { Message }