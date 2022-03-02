import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getTypeStructure, Metadata, parseHexTypes } from '@gear-js/api';
import { MetaParam } from 'utils/meta-parser';
import { RPCResponseError } from 'services/ServerRPCRequestService';
import { EventTypes } from 'types/alerts';
import { AddAlert } from 'store/actions/actions';
import { programService } from 'services/ProgramsRequestService';
import { getMessageAction } from 'store/actions/actions';
import { isDevChain, getLocalProgramMeta, fileNameHandler } from 'helpers';
import { RootState } from 'store/reducers';
import { MessageForm } from './children/MessageForm/MessageForm';
import ArrowBack from 'assets/images/arrow_back.svg';
import ProgramIllustration from 'assets/images/program_icon.svg';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import './ReplyMessage.scss';

type Params = { id: string };

export const ReplyMessage: VFC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams<Params>();
  const messageId = routeParams.id as string;

  const [meta, setMeta] = useState<Metadata>();
  const [types, setTypes] = useState<MetaParam | null>(null);
  const [ready, setReady] = useState(false);

  const { message } = useSelector((state: RootState) => state.messages);
  console.log(message);
  const { fetchMeta } = programService;
  const getMeta = isDevChain() ? getLocalProgramMeta : fetchMeta;

  useEffect(() => {
    dispatch(getMessageAction(messageId));
  }, [dispatch, messageId]);

  useEffect(() => {
    if (message) {
      getMeta(message.source)
        .then((res) => setMeta(JSON.parse(res.result.meta) ?? null))
        .catch((err: RPCResponseError) => dispatch(AddAlert({ type: EventTypes.ERROR, message: err.message })))
        .finally(() => setReady(true));
    }
  }, [message, getMeta, dispatch]);

  useEffect(() => {
    if (meta && meta.types && meta.handle_input) {
      const displayedTypes = parseHexTypes(meta.types);
      const inputType = getTypeStructure(meta.handle_input, displayedTypes);

      setTypes(inputType);
    }
  }, [meta, setTypes]);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return ready && message ? (
    <div className="wrapper">
      <header className="send-message__header">
        <button className="send-message__button-back" type="button" aria-label="back" onClick={handleBackButtonClick}>
          <img src={ArrowBack} alt="back" />
        </button>
        <h2 className="send-message__header-text">Send reply</h2>
        <img className="send-message__header-icon" src={ProgramIllustration} alt="program" />
        <h2 className="send-message__header-text send-message__header-text_colored">
          {fileNameHandler(message.source)}
        </h2>
      </header>
      <div className="send-message__block">
        <MessageForm messageId={message.source} reply={message.replyError} programName="df" meta={meta} types={types} />
      </div>
    </div>
  ) : (
    <div className="wrapper">
      <Spinner />
    </div>
  );
};
