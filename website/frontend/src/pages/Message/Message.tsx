import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CreateType } from '@gear-js/api';

import { Params } from './types';
import { MessageInfo } from './children/MessageInfo';

import { useProgram } from 'hooks';
import { getPreformattedText } from 'helpers';
import { getMessage } from 'services';
import { MessageModel } from 'types/message';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';
import { PageHeader } from 'components/blocks/PageHeader';

const Message = () => {
  const { messageId } = useParams() as Params;

  const [message, setMessage] = useState<MessageModel>();
  const [messagePayload, setMessagePayload] = useState('');

  const [program, meta] = useProgram(message?.source);

  useEffect(() => {
    getMessage(messageId).then(({ result }) => setMessage(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(message?.payload);
  useEffect(() => {
    if (program && message) {
      const inputOutput = meta?.init_output;
      const handleOutput = meta?.handle_output;

      const type = handleOutput || inputOutput || 'Bytes';

      const decodedPayload = new CreateType().create(type, message.payload, meta);

      setMessagePayload(getPreformattedText(decodedPayload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, message]);

  return (
    <div className="wrapper">
      {message ? (
        <>
          <PageHeader title="Message" fileName={messageId} />
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
