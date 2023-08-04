import { HexString } from '@polkadot/util/types';
import { useParams } from 'react-router-dom';

import { useMailboxItem } from 'features/mailbox';
import { MessageForm } from 'widgets/messageForm';
import { useMetadata } from 'features/metadata';
import styles from './Send.module.scss';

type MessageParams = {
  programId: HexString;
};

type ReplyParams = {
  messageId: HexString;
};

const Send = () => {
  const params = useParams() as MessageParams | ReplyParams;

  const isReply = 'messageId' in params;
  const id = isReply ? params.messageId : params.programId;

  const mailboxItem = useMailboxItem(isReply ? id : undefined);
  const [message] = mailboxItem || [];

  const programSource = isReply ? message?.source : id;
  const { metadata, isMetadataReady } = useMetadata(programSource);

  return (
    <>
      <h2 className={styles.heading}>{isReply ? 'Send Reply' : 'Send Message'}</h2>
      <MessageForm id={id} isReply={isReply} metadata={metadata} isLoading={!isMetadataReady} />
    </>
  );
};

export { Send };
