import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
  const { messageId } = useParams() as Params;

  const [message, setMessage] = useState<MessageModel>();
  const [messagePayload, setMessagePayload] = useState('');

  const [program, meta] = useProgram(message?.source);

  useEffect(() => {
    getMessage(messageId).then(({ result }) => setMessage(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!program || !message) {
      return;
    }

    const payload = meta && !message.exitCode ? getDecodedMessagePayload(meta, message) : message.payload;

    setMessagePayload(getPreformattedText(payload));
  }, [program, message, meta]);

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
