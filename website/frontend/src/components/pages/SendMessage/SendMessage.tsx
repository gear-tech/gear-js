import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useAlert } from 'react-alert';
import { useNavigate, useParams } from 'react-router-dom';
import { getTypeStructure, Metadata, parseHexTypes } from '@gear-js/api';
import { MetaParam } from 'utils/meta-parser';
import { RPC_METHODS } from 'consts';
import ServerRPCRequestService, { RPCResponseError } from 'services/ServerRPCRequestService';
import { GetMetaResponse } from 'api/responses';
import { AlertTypes } from 'types/alerts';
import { isDevChain, getLocalProgramMeta, fileNameHandler } from 'helpers';
import { MessageForm } from './children/MessageForm/MessageForm';
import ArrowBack from 'assets/images/arrow_back.svg';
import ProgramIllustration from 'assets/images/program_icon.svg';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import './SendMessage.scss';

export const SendMessage: VFC = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const routeParams = useParams();
  const programId = routeParams.id as string;

  const [meta, setMeta] = useState<Metadata>();
  const [types, setTypes] = useState<MetaParam | null>(null);
  const [ready, setReady] = useState(false);

  const fetchMeta = useCallback(async (id: string) => {
    const apiRequest = new ServerRPCRequestService();

    return apiRequest.callRPC<GetMetaResponse>(RPC_METHODS.GET_METADATA, { programId: id });
  }, []);

  const getMeta = isDevChain() ? getLocalProgramMeta : fetchMeta;

  useEffect(() => {
    if (!meta) {
      getMeta(programId)
        .then((res) => setMeta(JSON.parse(res.result.meta) ?? null))
        .catch((err: RPCResponseError) => alert.show(err.message, { type: AlertTypes.ERROR }))
        .finally(() => setReady(true));
    }
  }, [meta, programId, getMeta, alert]);

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

  return ready ? (
    <div className="wrapper">
      <header className="send-message__header">
        <button className="send-message__button-back" type="button" aria-label="back" onClick={handleBackButtonClick}>
          <img src={ArrowBack} alt="back" />
        </button>
        <h2 className="send-message__header-text">New message</h2>
        <img className="send-message__header-icon" src={ProgramIllustration} alt="program" />
        <h2 className="send-message__header-text send-message__header-text_colored">{fileNameHandler(programId)}</h2>
      </header>
      <div className="send-message__block">
        <MessageForm programId={programId} programName="df" meta={meta} types={types} />
      </div>
    </div>
  ) : (
    <div className="wrapper">
      <Spinner />
    </div>
  );
};
