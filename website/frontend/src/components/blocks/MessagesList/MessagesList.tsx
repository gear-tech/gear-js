import React, { VFC } from 'react';
import clsx from 'clsx';
import { useAlert } from 'hooks';
import { Link } from 'react-router-dom';
import { copyToClipboard, fileNameHandler, formatDate } from 'helpers';
import copyIcon from 'assets/images/copy.svg';
import codeIcon from 'assets/images/code_icon.svg';
import idIcon from 'assets/images/id_icon.svg';
import timestampIcon from 'assets/images/timestamp_icon.svg';
import { MessageModel } from 'types/message';
import './MessagesList.scss';

type Props = {
  messages?: MessageModel[] | null;
};

export const MessagesList: VFC<Props> = ({ messages }) => {
  const alert = useAlert();

  return (
    <div className="messages__list">
      <div className={clsx('messages__list-block', 'messages__list-block__header')}>
        <div className="messages__list-item">
          <img className="messages__list-icon" src={codeIcon} alt="program name" />
          <p className="messages__list-caption">Program name</p>
        </div>
        <div className="messages__list-item">
          <img className="messages__list-icon" src={idIcon} alt="program id" />
          <p>Message Id</p>
        </div>
        <div className="messages__list-item">
          <img className="messages__list-icon" src={timestampIcon} alt="program date" />
          <p>Timestamp</p>
        </div>
      </div>
      {messages &&
        messages.length > 0 &&
        messages.map((message: MessageModel) => (
          <div
            key={message.id}
            className={clsx(
              'messages__list-block',
              message.replyError === '0' || message.replyError === null
                ? 'messages__list-block_success'
                : 'messages__list-block_error'
            )}
          >
            <div className="messages__list-item">
              <span className="messages__list-status" />
              <p className="messages__list-caption">{message.destination && fileNameHandler(message.destination)}</p>
            </div>
            <div className="messages__list-item">
              <Link className="messages__list-link" to={`/message/${message.id}`}>
                {message.id}
              </Link>
              <div className="programsCopyId">
                <button type="button" onClick={() => copyToClipboard(message.id, alert, 'Message ID copied')}>
                  <img src={copyIcon} alt="copy message ID" />
                </button>
              </div>
            </div>
            <div className="messages__list-item">
              <p>{message.timestamp && formatDate(message.timestamp)}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
