import { useParams } from 'react-router-dom';
import { HexString } from '@polkadot/util/types';

import { MessageForm } from 'widgets/messageForm';
import { useMessage, useProgram } from 'hooks';

import styles from './Send.module.scss';

const Send = () => {
  const { programId, messageId } = useParams();

  const id = (programId || messageId) as HexString;
  const isReply = !!messageId;

  const { message } = useMessage(messageId);

  const programSource = programId || message?.source;
  const { metadata, isLoading } = useProgram(programSource, true);

  const heading = isReply ? 'Send Reply' : 'Send Message';

  return (
    <>
      <h2 className={styles.heading}>{heading}</h2>
      <MessageForm id={id} isReply={isReply} metadata={metadata} isLoading={isLoading} />
    </>
  );
};

export { Send };
