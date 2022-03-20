import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Metadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';
import { MetaParam } from 'utils/meta-parser';
import { RPCResponseError } from 'services/ServerRPCRequestService';
import { EventTypes } from 'types/alerts';
import { programService } from 'services/ProgramsRequestService';
import { RootState } from 'store/reducers';
import { AddAlert, getMessageAction } from 'store/actions/actions';
import { isDevChain, getLocalProgramMeta, fileNameHandler } from 'helpers';
import { MessageForm } from './children/MessageForm/MessageForm';
import ArrowBack from 'assets/images/arrow_back.svg';
import ProgramIllustration from 'assets/images/program_icon.svg';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import './Send.scss';

const Send = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { programId = '', messageId = '' } = useParams();

  const [meta, setMeta] = useState<Metadata>();
  const [types, setTypes] = useState<MetaParam | null>(null);
  const [ready, setReady] = useState(false);

  const { message } = useSelector((state: RootState) => state.messages);

  const { fetchMeta } = programService;
  const getMeta = isDevChain() ? getLocalProgramMeta : fetchMeta;

  useEffect(() => {
    if (messageId) {
      dispatch(getMessageAction(messageId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!meta && (programId || message)) {
      getMeta(message ? message.source : programId)
        .then((res) => setMeta(JSON.parse(res.result.meta) ?? null))
        .catch((err: RPCResponseError) => dispatch(AddAlert({ type: EventTypes.ERROR, message: err.message })))
        .finally(() => setReady(true));
    }
  }, [meta, programId, message, getMeta, dispatch]);

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
        <h2 className="send-message__header-text send-message__header-text_colored">
          {fileNameHandler(programId || messageId)}
        </h2>
      </header>
      <div className="send-message__block">
        <MessageForm addressId={programId || messageId} replyCode={message?.replyError} meta={meta} types={types} />
      </div>
    </div>
  ) : (
    <div className="wrapper">
      <Spinner />
    </div>
  );
};

export default Send;
