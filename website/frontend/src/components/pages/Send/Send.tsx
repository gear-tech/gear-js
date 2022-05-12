import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import { Metadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';
import { MetaItem } from 'components/MetaFields';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import { RPCResponseError } from 'services/ServerRPCRequestService';
import { messagesService } from 'services/MessagesRequestServices';
import { programService } from 'services/ProgramsRequestService';
import { MessageModel } from 'types/message';
import { isDevChain, getLocalProgramMeta } from 'helpers';
import { MessageForm } from './children/MessageForm/MessageForm';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import './Send.scss';

const Send = () => {
  const alert = useAlert();
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

  return ready ? (
    <div className="wrapper">
      <PageHeader fileName={id} title={programId ? 'New message' : 'Send reply'} />
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
