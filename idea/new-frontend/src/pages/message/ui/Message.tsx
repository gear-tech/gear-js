import { useParams } from 'react-router-dom';

import { useProgram, useMessage } from 'hooks';
import { MessageInfo } from 'entities/message';

import { PageParams } from '../model';
import { Header } from './header';

const Message = () => {
  const { messageId } = useParams() as PageParams;

  const { message, isLoading: isMesageLoading } = useMessage(messageId);
  const { metadata, isLoading: isProgramLoading } = useProgram(message?.source, true);

  return (
    <div>
      <Header messageId={messageId} exitCode={message?.exitCode} timestamp={message?.timestamp} />
      <MessageInfo metadata={metadata} message={message} isLoading={isMesageLoading || isProgramLoading} />
    </div>
  );
};

export { Message };
