import { useParams } from 'react-router-dom';

import { useMessage } from '@/hooks';
import { MessageInfo } from '@/entities/message';
import { useMetadata } from '@/features/metadata';

import { PageParams } from '../model';
import { Header } from './header';

const Message = () => {
  const { messageId } = useParams() as PageParams;

  const { message, isLoading: isMesageLoading } = useMessage(messageId);

  // TODO: backend
  const programId = '0x01';
  const metaHash = '0x01';

  const isProgram = !!programId;

  const { metadata, isMetadataReady } = useMetadata(metaHash);

  return (
    <div>
      <Header messageId={messageId} exitCode={message?.exitCode} timestamp={message?.timestamp} />
      <MessageInfo
        metadata={metadata}
        message={message}
        isLoading={isMesageLoading || (isProgram && !isMetadataReady)}
      />
    </div>
  );
};

export { Message };
