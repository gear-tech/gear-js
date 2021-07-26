import React from "react";
import { useDispatch, useSelector } from 'react-redux';

import { SocketService } from 'services/SocketService';
import { RootState } from 'store/reducers';
import { sendMessageResetAction } from 'store/actions/actions';
import StatusPanel from 'components/blocks/StatusPanel';
import { MessageForm } from "components/blocks/MessageForm";
import { MessageStatus } from "components/blocks/MessageStatus";
import { MessageHeader } from "components/blocks/MessageHeader";

import './Message.scss'

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

    if (messageSendingError) {
        statusPanelText = messageSendingError
    } else if (messageSendingStatus && typeof messageSendingStatus === "string") {
        statusPanelText = messageSendingStatus;
    } 
    
    return (
        <div className="message-form">  
            <MessageHeader programName={programName} handleClose={handleClose} isMessageForm={isMessageForm}/>
            {
                isMessageForm
                &&
                <MessageForm programHash={programHash} programName={programName} socketService={socketService} handleClose={handleClose}/>
            }
            {
                messageSendingStatus && typeof messageSendingStatus !== "string"
                &&
                <MessageStatus 
                    status={messageSendingStatus.status} 
                    blockHash={messageSendingStatus.blockHash} 
                    data={messageSendingStatus.data}
                    programName={programName}
                />
            }
            {statusPanelText && <StatusPanel onClose={() => {
                dispatch(sendMessageResetAction())
            }} statusPanelText={statusPanelText} isError={!!messageSendingError}/>}
        </div>
    )
}

export { Message }