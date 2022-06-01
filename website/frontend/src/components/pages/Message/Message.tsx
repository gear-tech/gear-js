import React, { FC, useEffect, useState } from 'react';
import { CreateType } from '@gear-js/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Metadata } from '@gear-js/api';
import clsx from 'clsx';
import { formatDate } from 'helpers';
import backIcon from 'assets/images/arrow_back_thick.svg';
import { Spinner } from 'components/common/Spinner/Spinner';
import { Hint } from 'components/blocks/Hint/Hint';
import { getPreformattedText } from 'helpers';
import { getMessage, getProgram } from 'services';
import { MessageModel } from 'types/message';
import { ProgramModel } from 'types/program';
import './Message.scss';

export const Message: FC = () => {
  const navigate = useNavigate();
  const routeParams = useParams();
  const messageId = routeParams.id as string;

  const [message, setMessage] = useState<MessageModel>();
  const [program, setProgram] = useState<ProgramModel>();
  const [messagePayload, setMessagePayload] = useState('');

  useEffect(() => {
    getMessage(messageId).then(({ result }) => setMessage(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (message) {
      getProgram(message.source).then(({ result }) => setProgram(result));
    }
  }, [message]);

  useEffect(() => {
    if (program && message) {
      const createType = new CreateType();
      let type = 'Bytes';
      let decodedPayload = null;

      if (program.meta) {
        const parsedMeta: Metadata = JSON.parse(program.meta.meta as string) ?? null;

        if (parsedMeta?.handle_output) {
          type = parsedMeta.handle_output;
        }

        if (!parsedMeta?.handle_output && parsedMeta?.init_output) {
          type = parsedMeta.init_output;
        }

        decodedPayload = createType.create(type, message.payload, parsedMeta).toHuman();
      } else {
        decodedPayload = createType.create(type, message.payload);
      }

      setMessagePayload(getPreformattedText(decodedPayload));
    }
  }, [program, message]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderError = (error: string | null) => {
    if (error !== '0' && error !== '1' && error !== null) {
      return <Hint>{error}</Hint>;
    }

    return null;
  };

  return message ? (
    <div className="message">
      <div className={clsx('message__block', 'message__id')}>
        <span className="message__block-caption">MESSAGE ID:</span>
        <div className="message__status-block">
          <div className="message__status-is-error">
            <span
              className={clsx(
                'message__block-status',
                message.replyError === '0' || message.replyError === null
                  ? 'message__block-status_success'
                  : 'message__block-status_error '
              )}
            />
            {renderError(message.replyError)}
          </div>
          <p className="message__block-paragraph">{message.id}</p>
        </div>
      </div>
      <div className="message__block">
        <span className="message__block-caption">Source:</span>
        <p className="message__block-paragraph">{message.source}</p>
      </div>
      <div className="message__block">
        <span className="message__block-caption">Destination:</span>
        <p className="message__block-paragraph">{message.destination}</p>
      </div>
      <div className="message__block">
        <span className="message__block-caption">Timestamp:</span>
        <p className="message__block-paragraph">{formatDate(message.timestamp)}</p>
      </div>
      {messagePayload ? <pre className="message__meta">{messagePayload}</pre> : <Spinner />}
      <div className="message__buttons">
        <button type="button" className="message__button" onClick={handleGoBack}>
          <img src={backIcon} className="message__button-icon" alt="reply" />
          <span className="nodes-hide-text">Back</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="message">
      <Spinner />
    </div>
  );
};
