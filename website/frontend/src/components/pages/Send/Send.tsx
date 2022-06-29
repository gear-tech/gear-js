import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MessageForm } from './children/MessageForm/MessageForm';

import { useProgram } from 'hooks';
import { MessageModel } from 'types/message';
import { messagesService } from 'services/MessagesRequestServices';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';

const Send = () => {
  const { programId = '', messageId = '' } = useParams();

  const id = programId || messageId;

  const [message, setMessage] = useState<MessageModel>();

  const [program, metadata] = useProgram(programId || message?.source);

  useEffect(() => {
    if (messageId) {
      messagesService.fetchMessage(messageId).then(({ result }) => setMessage(result));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isReply = Boolean(messageId);
  const isLoading = !(programId ? program : program && message);

  return (
    <div className="wrapper">
      {isLoading ? (
        <Spinner absolute />
      ) : (
        <>
          <PageHeader title={programId ? 'New message' : 'Send reply'} fileName={program?.name || id} />
          <Box>
            <MessageForm id={id} isReply={isReply} replyErrorCode={message?.replyError} metadata={metadata} />
          </Box>
        </>
      )}
    </div>
  );
};

export { Send };
