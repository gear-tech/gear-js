import { useParams } from 'react-router-dom';

import { useMessage } from '@/hooks';
import { MessageInfo, Type } from '@/entities/message';
import { useMetadata } from '@/features/metadata';

import { PageParams } from '../model';
import { Header } from './header';

const Message = () => {
  const { messageId } = useParams() as PageParams;
  const { message, isLoading } = useMessage(messageId);
  const { type, metahash, exitCode, timestamp } = message || {};
  const isMessageFromProgram = type === Type.UserMessageSent;

  const { metadata, isMetadataReady } = useMetadata(metahash);

  return (
    <div>
      <Header messageId={messageId} exitCode={exitCode} timestamp={timestamp} />

      <MessageInfo
        metadata={metadata}
        message={message}
        isLoading={isLoading || (isMessageFromProgram && !isMetadataReady)}
      />
    </div>
  );
};

export { Message };
