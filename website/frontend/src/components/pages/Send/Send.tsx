import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';
import { MetaItem } from 'components/MetaFields';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import { messagesService } from 'services/MessagesRequestServices';
import { MessageModel } from 'types/message';
import { useProgram } from 'hooks';
import { MessageForm } from './children/MessageForm/MessageForm';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import './Send.scss';

const Send = () => {
  const { programId = '', messageId = '' } = useParams();

  const id = programId || messageId;

  const [message, setMessage] = useState<MessageModel>();
  const [program, metadata] = useProgram(programId || message?.source);

  const types = useMemo(() => {
    if (metadata && metadata.types && metadata.handle_input) {
      const decodedTypes = decodeHexTypes(metadata.types);
      const typeStructure: MetaItem = createPayloadTypeStructure(metadata.handle_input, decodedTypes, true);

      return typeStructure;
    }

    return null;
  }, [metadata]);

  useEffect(() => {
    if (messageId) {
      messagesService.fetchMessage(messageId).then(({ result }) => setMessage(result));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrapper">
      {program ? (
        <>
          <PageHeader title={programId ? 'New message' : 'Send reply'} fileName={program?.name || id} />
          <div className="send-message__block">
            <MessageForm id={id} replyErrorCode={message?.replyError} meta={metadata} types={types} />
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export { Send };
