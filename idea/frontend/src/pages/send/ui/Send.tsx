import { HexString } from '@polkadot/util/types';
import { useParams } from 'react-router-dom';

import { useMailboxItem } from '@/features/mailbox';
import { MessageForm, SailsMessageForm } from '@/widgets/messageForm';
import { useMetadata } from '@/features/metadata';
import { useSails } from '@/features/sails';
import { useProgram } from '@/features/program';
import { isAnyKey } from '@/shared/helpers';

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

  const programId = isReply ? message?.source : id;

  const { data: program } = useProgram(programId);
  const { metadata, isMetadataReady } = useMetadata(program?.metahash);
  const { sails } = useSails(program?.codeId);
  const isAnyFunction = sails ? Object.values(sails.services).some(({ functions }) => isAnyKey(functions)) : false;

  return (
    <>
      <h2 className={styles.heading}>{isReply ? 'Send Reply' : 'Send Message'}</h2>

      {sails && isAnyFunction ? (
        <SailsMessageForm id={id} programId={programId} isReply={isReply} sails={sails} />
      ) : (
        <MessageForm id={id} programId={programId} isReply={isReply} metadata={metadata} isLoading={!isMetadataReady} />
      )}
    </>
  );
};

export { Send };
