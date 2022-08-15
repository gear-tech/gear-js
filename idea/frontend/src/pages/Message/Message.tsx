import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAlert } from '@gear-js/react-hooks';

import { Params } from './types';
import { getDecodedMessagePayload } from './helpers';
import { MessageInfo } from './children/MessageInfo';
import { MessagePageHeader } from './children/MessagePageHeader';

import { useProgram } from 'hooks';
import { getPreformattedText } from 'helpers';
import { getMessage } from 'services';
import { MessageModel } from 'types/message';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';

const Message = () => {
  const alert = useAlert();
  const { messageId } = useParams() as Params;

  const [message, setMessage] = useState<MessageModel>();
  const [messagePayload, setMessagePayload] = useState('');

  const { metadata, isLoading } = useProgram(message?.source, true);

  useEffect(() => {
    getMessage(messageId)
      .then(({ result }) => setMessage(result))
      .catch((error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading || !message) {
      return;
    }

    const payload = metadata && !message.exitCode ? getDecodedMessagePayload(metadata, message) : message.payload;

    setMessagePayload(payload ? getPreformattedText(payload) : '-');
  }, [metadata, message, isLoading]);

  return (
    <div className="wrapper">
      {message ? (
        <>
          <MessagePageHeader id={messageId} exitCode={message.exitCode} />
          <Box>
            <MessageInfo message={message} payload={messagePayload} />
          </Box>
        </>
      ) : (
        <Spinner absolute />
      )}
    </div>
  );
};

export { Message };
