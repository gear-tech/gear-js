import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import { useProgram } from 'hooks';
import { MessageModel } from 'types/message';
import { messagesService } from 'services/MessagesRequestServices';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import { MessageForm, RenderButtonsProps } from 'components/blocks/MessageForm';
import sendMessageSVG from 'assets/images/message.svg';

const Send = () => {
  const { programId = '', messageId = '' } = useParams();

  const [message, setMessage] = useState<MessageModel>();

  const { program, metadata } = useProgram(programId || message?.source);

  const id = programId || messageId;
  const isReply = Boolean(messageId);

  const renderFormButtons = ({ isDisabled, calculateGas }: RenderButtonsProps) => (
    <>
      <Button text="Calculate Gas" onClick={calculateGas} disabled={isDisabled} />
      <Button
        type="submit"
        icon={sendMessageSVG}
        text={isReply ? 'Send reply' : 'Send message'}
        disabled={isDisabled}
      />
    </>
  );

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
          <PageHeader title={isReply ? 'Send reply' : 'New message'} fileName={program.name || id} />
          <Box>
            <MessageForm id={id as Hex} isReply={isReply} metadata={metadata} renderButtons={renderFormButtons} />
          </Box>
        </>
      ) : (
        <Spinner absolute />
      )}
    </div>
  );
};

export { Send };
