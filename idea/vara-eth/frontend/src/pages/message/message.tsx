import { HexString } from '@vara-eth/api';
import { generatePath, useParams } from 'react-router-dom';
import { formatEther } from 'viem';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import { BackButton, Balance, ExplorerLink, HashLink, PageContainer } from '@/components';
import {
  useGetMessageRequestByIdQuery,
  useGetMessageSentByIdQuery,
  useGetReplyRequestByIdQuery,
  useGetReplySentByIdQuery,
} from '@/features/messages';
import { routes } from '@/shared/config';
import { cx } from '@/shared/utils';

import ArrowSVG from './arrow.svg?react';
import styles from './message.module.scss';

type Params = {
  messageId: HexString;
};

const Message = () => {
  const { messageId } = useParams() as Params;

  const messageRequest = useGetMessageRequestByIdQuery(messageId);
  const messageSent = useGetMessageSentByIdQuery(messageId);
  const replyRequest = useGetReplyRequestByIdQuery(messageId);
  const replySent = useGetReplySentByIdQuery(messageId);

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

        {replyRequest.data && (
          <div className={styles.body}>
            <h2 className={styles.title}>Source Address</h2>

            <div className={styles.withExplorerLink}>
              <HashLink hash={replyRequest.data.sourceAddress} />
              <ExplorerLink path="address" id={replyRequest.data.sourceAddress} />
            </div>

            <h2 className={styles.title}>Program ID</h2>

            <div className={styles.withExplorerLink}>
              <HashLink
                hash={replyRequest.data.programId}
                href={generatePath(routes.program, { programId: replyRequest.data.programId })}
              />

              <ExplorerLink path="address" id={replyRequest.data.programId} />
            </div>

            <h2 className={styles.title}>Value</h2>
            <Balance value={formatEther(BigInt(replyRequest.data.value))} units="ETH" />

            <h2 className={styles.title}>Transaction Hash</h2>

            <div className={styles.withExplorerLink}>
              <HashLink hash={replyRequest.data.txHash} truncateSize="xxl" />
              <ExplorerLink path="tx" id={replyRequest.data.txHash} />
            </div>

            <h2 className={styles.title}>Block Number</h2>

            <div className={styles.blockNumber}>
              <div>
                #{replyRequest.data.blockNumber} <ExplorerLink path="block" id={replyRequest.data.blockNumber} />
              </div>

              <div>{new Date(replyRequest.data.createdAt).toLocaleString()}</div>
            </div>
          </div>
        )}

        {replySent.data && (
          <div className={styles.body}>
            <h2 className={styles.title}>Replied To ID</h2>
            <HashLink hash={replySent.data.repliedToId} truncateSize="xxl" />

            <h2 className={styles.title}>Reply Code</h2>
            <div>{replySent.data.replyCode}</div>

            <h2 className={styles.title}>Source Program ID</h2>

            <div className={styles.withExplorerLink}>
              <HashLink
                hash={replySent.data.sourceProgramId}
                href={generatePath(routes.program, { programId: replySent.data.sourceProgramId })}
              />

              <ExplorerLink path="address" id={replySent.data.sourceProgramId} />
            </div>

            <h2 className={styles.title}>Destination</h2>

            <div className={styles.withExplorerLink}>
              <HashLink hash={replySent.data.destination} />
              <ExplorerLink path="address" id={replySent.data.destination} />
            </div>

            <h2 className={styles.title}>Value</h2>
            <Balance value={formatEther(BigInt(replySent.data.value))} units="ETH" />

            <h2 className={styles.title}>Is Call</h2>
            <div>{String(replySent.data.isCall)}</div>

            {replySent.data.stateTransition && (
              <>
                <h2 className={styles.title}>State Transition Hash</h2>
                <HashLink hash={replySent.data.stateTransition.hash} truncateSize="xxl" />
              </>
            )}

            <h2 className={styles.title}>Created At</h2>
            <div>{new Date(replySent.data.createdAt).toLocaleString()}</div>
          </div>
        )}
      </div>

      <div className={styles.column}>
        <h2 className={styles.payloadTitle}>Payload</h2>

        {messageRequest.data && <div className={styles.payload}>{messageRequest.data.payload}</div>}
        {messageSent.data && <div className={styles.payload}>{messageSent.data.payload}</div>}
        {replyRequest.data && <div className={styles.payload}>{replyRequest.data.payload}</div>}
        {replySent.data && <div className={styles.payload}>{replySent.data.payload}</div>}
      </div>
    </PageContainer>
  );
};

export { Message };
