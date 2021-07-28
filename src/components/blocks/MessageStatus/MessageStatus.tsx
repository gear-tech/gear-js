import React from 'react';

import { fileNameHandler } from 'helpers';

import './MessageStatus.scss'

type Props = {
    status: string;
    blockHash: string;
    data: string;
    programName: string;
}

const MessageStatus = ({ status, blockHash, data, programName }: Props) => (
    <div className="message-status">
        <div className="message-status--info">
            <div className="message-status--info__title">
                File:
            </div>
            <span className="message-status--info__text">
                {fileNameHandler(programName)}
            </span>
        </div>
        <div className="message-status--info">
            <div className="message-status--info__title">
                Status:
            </div>
            <span className="message-status--info__text">
                {status}
            </span>
        </div>
        <div className="message-status--info">
            <div className="message-status--info__title">
                BlockHash:
            </div>
            <span className="message-status--info__text">
                {blockHash}
            </span>
        </div>
        <div className="message-status--info">
            <div className="message-status--info__title">
                Data:
            </div>
            <span className="message-status--info__text">
                {data}
            </span>
        </div>
    </div>
)

export { MessageStatus };