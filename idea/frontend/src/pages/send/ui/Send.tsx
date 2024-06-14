import { HexString } from '@polkadot/util/types';
import { useParams } from 'react-router-dom';

import { useMailboxItem } from '@/features/mailbox';
import { MessageForm } from '@/widgets/messageForm';
import { useMetadata } from '@/features/metadata';
import { useProgram } from '@/hooks';
import styles from './Send.module.scss';
import { PayloadForm } from '@/features/sails';

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

  const programId = isReply ? message?.source : id;

  const { program } = useProgram(programId);
  const { metadata, isMetadataReady } = useMetadata(program?.metahash);

  return (
    <>
      <h2 className={styles.heading}>{isReply ? 'Send Reply' : 'Send Message'}</h2>

      {/* {programId && <PayloadForm programId={programId} />} */}

      <MessageForm id={id} programId={programId} isReply={isReply} metadata={metadata} isLoading={!isMetadataReady} />
    </>
  );
};

export { Send };
