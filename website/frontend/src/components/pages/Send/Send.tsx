import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useNavigate, useParams } from 'react-router-dom';
import { Metadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';
import { MetaItem } from 'components/MetaFields';
import { RPCResponseError } from 'services/ServerRPCRequestService';
import { messagesService } from 'services/MessagesRequestServices';
import { programService } from 'services/ProgramsRequestService';
import { MessageModel } from 'types/message';
import { isDevChain, getLocalProgramMeta, fileNameHandler } from 'helpers';
import { MessageForm } from './children/MessageForm/MessageForm';
import ArrowBack from 'assets/images/arrow_back.svg';
import ProgramIllustration from 'assets/images/program_icon.svg';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import './Send.scss';

const Send = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const { programId = '', messageId = '' } = useParams();
  const id = programId || messageId;

  const [message, setMessage] = useState<MessageModel>();
  const [meta, setMeta] = useState<Metadata>();
  const [types, setTypes] = useState<MetaItem | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (messageId) {
      messagesService.fetchMessage(messageId).then(({ result }) => setMessage(result));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!meta) {
      const getMeta = isDevChain() ? getLocalProgramMeta : programService.fetchMeta;
      const metaSource = message?.source || programId;

      getMeta(metaSource)
        .then((res) => setMeta(JSON.parse(res.result.meta) ?? null))
        .catch((err: RPCResponseError) => alert.error(err.message))
        .finally(() => setReady(true));
    }
  }, [meta, programId, message, alert]);

  useEffect(() => {
    if (meta && meta.types && meta.handle_input) {
      const decodedTypes = decodeHexTypes(meta.types);
      const typeStructure = createPayloadTypeStructure(meta.handle_input, decodedTypes, true);

      setTypes(typeStructure);
    }
  }, [meta, setTypes]);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return ready ? (
    <div className="wrapper">
      <header className="send-message__header">
        <button className="send-message__button-back" type="button" aria-label="back" onClick={handleBackButtonClick}>
          <img src={ArrowBack} alt="back" />
        </button>
        <h2 className="send-message__header-text">{programId ? 'New message' : 'Send reply'}</h2>
        <img className="send-message__header-icon" src={ProgramIllustration} alt="program" />
        <h2 className="send-message__header-text send-message__header-text_colored">{fileNameHandler(id)}</h2>
      </header>
      <div className="send-message__block">
        <MessageForm id={id} replyErrorCode={message?.replyError} meta={meta} types={types} />
      </div>
    </div>
  ) : (
    <div className="wrapper">
      <Spinner />
    </div>
  );
};

export { Send };
