import { HexString } from '@vara-eth/api';
import { generatePath, useParams } from 'react-router-dom';
import { formatEther } from 'viem';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import { BackButton, Balance, ExplorerLink, HashLink, PageContainer } from '@/components';
import { useGetMessageRequestsByIdQuery, useGetMessageSentByIdQuery } from '@/features/messages';
import { routes } from '@/shared/config';
import { cx } from '@/shared/utils';

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

          <ArrowSVG className={cx(styles.arrow, messageSent.data && styles.from)} />
          <HashLink hash={messageId} truncateSize="xxl" />
        </header>

        {messageRequest.data && (
          <div className={styles.body}>
            <h2 className={styles.title}>Source Address</h2>

            <div className={styles.withExplorerLink}>
              <HashLink hash={messageRequest.data.sourceAddress} />
              <ExplorerLink path="address" id={messageRequest.data.sourceAddress} />
            </div>

            <h2 className={styles.title}>Program ID</h2>

            <div className={styles.withExplorerLink}>
              <HashLink
                hash={messageRequest.data.programId}
                href={generatePath(routes.program, { programId: messageRequest.data.programId })}
              />
              <ExplorerLink path="address" id={messageRequest.data.programId} />
            </div>

            <h2 className={styles.title}>Value</h2>
            <Balance value={formatEther(BigInt(messageRequest.data.value))} units="ETH" />

            <h2 className={styles.title}>Call Reply</h2>
            <div>{String(messageRequest.data.callReply)}</div>

            <h2 className={styles.title}>Transaction Hash</h2>

            <div className={styles.withExplorerLink}>
              <HashLink hash={messageRequest.data.txHash} truncateSize="xxl" />
              <ExplorerLink path="tx" id={messageRequest.data.txHash} />
            </div>

            <h2 className={styles.title}>Block Number</h2>

            <div className={styles.blockNumber}>
              <div>
                #{messageRequest.data.blockNumber} <ExplorerLink path="block" id={messageRequest.data.blockNumber} />
              </div>

              <div>{new Date(messageRequest.data.createdAt).toLocaleString()}</div>
            </div>
          </div>
        )}

        {messageSent.data && (
          <div className={styles.body}>
            <h2 className={styles.title}>Source Program ID</h2>

            <div className={styles.withExplorerLink}>
              <HashLink
                hash={messageSent.data.sourceProgramId}
                href={generatePath(routes.program, { programId: messageSent.data.sourceProgramId })}
              />

              <ExplorerLink path="address" id={messageSent.data.sourceProgramId} />
            </div>

            <h2 className={styles.title}>Destination</h2>

            <div className={styles.withExplorerLink}>
              <HashLink hash={messageSent.data.destination} />
              <ExplorerLink path="address" id={messageSent.data.destination} />
            </div>

            <h2 className={styles.title}>Value</h2>
            <Balance value={formatEther(BigInt(messageSent.data.value))} units="ETH" />

            <h2 className={styles.title}>Is Call</h2>
            <div>{String(messageSent.data.isCall)}</div>

            {messageSent.data.stateTransition && (
              <>
                <h2 className={styles.title}>State Transition Hash</h2>
                <HashLink hash={messageSent.data.stateTransition.hash} truncateSize="xxl" />
              </>
            )}

            <h2 className={styles.title}>Created At</h2>
            <div>{new Date(messageSent.data.createdAt).toLocaleString()}</div>
          </div>
        )}
      </div>

      <div className={styles.column}>
        <h2 className={styles.payloadTitle}>Payload</h2>

        {messageRequest.data && <div className={styles.payload}>{messageRequest.data.payload}</div>}
        {messageSent.data && <div className={styles.payload}>{messageSent.data.payload}</div>}
      </div>
    </PageContainer>
  );
};

export { Message };
