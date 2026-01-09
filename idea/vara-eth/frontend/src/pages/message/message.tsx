import { HexString } from '@vara-eth/api';
import { useParams } from 'react-router-dom';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import { BackButton, HashLink, PageContainer } from '@/components';
import { useGetMessageRequestsByIdQuery, useGetMessageSentByIdQuery } from '@/features/messages';
import { getTruncatedText } from '@/shared/utils';

import ArrowSVG from './arrow.svg?react';
import styles from './message.module.scss';

type Params = {
  messageId: HexString;
};

const Message = () => {
  const { messageId } = useParams() as Params;

  const messageRequest = useGetMessageRequestsByIdQuery(messageId);
  const messageSent = useGetMessageSentByIdQuery(messageId);

  return (
    <PageContainer className={styles.container}>
      <div className={styles.column}>
        <header className={styles.header}>
          <BackButton variant="icon" className={styles.backButton}>
            <ArrowLeftSVG />
          </BackButton>

          {/* TODO: arrow direction */}
          <ArrowSVG />
          <HashLink hash={messageId} truncateSize="xxl" />
        </header>

        {messageRequest.data && (
          <div className={styles.body}>
            <h2 className={styles.title}>Source Address</h2>
            <div>{messageRequest.data.sourceAddress}</div>

            <h2 className={styles.title}>Program ID</h2>
            <div>{messageRequest.data.programId}</div>

            <h2 className={styles.title}>Payload</h2>
            <div>{getTruncatedText(messageRequest.data.payload)}</div>

            <h2 className={styles.title}>Value</h2>
            <div>{messageRequest.data.value}</div>

            <h2 className={styles.title}>Call Reply</h2>
            <div>{String(messageRequest.data.callReply)}</div>

            <h2 className={styles.title}>Transaction Hash</h2>
            <div>{getTruncatedText(messageRequest.data.txHash)}</div>

            <h2 className={styles.title}>Block Number</h2>
            <div>{messageRequest.data.blockNumber}</div>
          </div>
        )}

        {messageSent.data && (
          <div className={styles.body}>
            <h2 className={styles.title}>Source Program ID</h2>
            <div>{messageSent.data.sourceProgramId}</div>

            <h2 className={styles.title}>Destination</h2>
            <div>{messageSent.data.destination}</div>

            <h2 className={styles.title}>Payload</h2>
            <div>{getTruncatedText(messageSent.data.payload)}</div>

            <h2 className={styles.title}>Value</h2>
            <div>{messageSent.data.value}</div>

            <h2 className={styles.title}>Is Call</h2>
            <div>{String(messageSent.data.isCall)}</div>

            <h2 className={styles.title}>State Transition ID</h2>
            <div>{messageSent.data.stateTransitionId}</div>

            <h2 className={styles.title}>Created At</h2>
            <div>{messageSent.data.createdAt}</div>
          </div>
        )}
      </div>

      <div />
    </PageContainer>
  );
};

export { Message };
