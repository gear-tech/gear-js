import React, { FC, useEffect, useState } from 'react';
import { CreateType } from '@gear-js/api';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Metadata } from '@gear-js/api';
import clsx from 'clsx';
import { formatDate } from 'helpers';
import { RootState } from 'store/reducers';
import { getProgramAction, resetProgramAction, getMessageAction, resetMessageAction } from 'store/actions/actions';
import backIcon from 'assets/images/arrow_back_thick.svg';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { Hint } from 'components/blocks/Hint/Hint';
import './Message.scss';

type Params = { id: string };

export const Message: FC = () => {
  const routeParams = useParams<Params>();
  const messageId = routeParams.id;
  const history = useHistory();
  const dispatch = useDispatch();

  const { message } = useSelector((state: RootState) => state.messages);
  const { program } = useSelector((state: RootState) => state.programs);

  const [messagePayload, setMessagePayload] = useState('');

  useEffect(() => {
    dispatch(getMessageAction(messageId));
    return () => {
      dispatch(resetMessageAction());
    };
  }, [dispatch, messageId]);

  useEffect(() => {
    if (message) {
      dispatch(getProgramAction(message.source));
    }
    return () => {
      dispatch(resetProgramAction());
    };
  }, [dispatch, message]);

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

      setMessagePayload(JSON.stringify(decodedPayload, null, 4));
    }
  }, [program, message]);

  const handleGoBack = () => {
    history.goBack();
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
