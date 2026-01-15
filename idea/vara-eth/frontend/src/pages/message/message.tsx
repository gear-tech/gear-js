import { HexString } from '@vara-eth/api';
import { generatePath, useParams } from 'react-router-dom';
import { formatEther } from 'viem';

import { Balance, ChainEntity, ExplorerLink, HashLink, PageContainer } from '@/components';
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
        <ChainEntity.Header>
          <ChainEntity.BackButton />

          <div className={styles.title}>
            <ArrowSVG className={cx(styles.arrow, messageSent.data && styles.from)} />
            <ChainEntity.Title id={messageId} />
          </div>
        </ChainEntity.Header>

        {messageRequest.data && (
          <ChainEntity.Data>
            <ChainEntity.Key>Source Address</ChainEntity.Key>

            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink hash={messageRequest.data.sourceAddress} />
              <ExplorerLink path="address" id={messageRequest.data.sourceAddress} />
            </ChainEntity.Value>

            <ChainEntity.Key>Program ID</ChainEntity.Key>

            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink
                hash={messageRequest.data.programId}
                href={generatePath(routes.program, { programId: messageRequest.data.programId })}
              />
              <ExplorerLink path="address" id={messageRequest.data.programId} />
            </ChainEntity.Value>

            <ChainEntity.Key>Value</ChainEntity.Key>
            <Balance value={formatEther(BigInt(messageRequest.data.value))} units="ETH" />

            <ChainEntity.Key>Call Reply</ChainEntity.Key>
            <ChainEntity.Value>{String(messageRequest.data.callReply)}</ChainEntity.Value>

            <ChainEntity.Key>Transaction Hash</ChainEntity.Key>

            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink hash={messageRequest.data.txHash} truncateSize="xxl" />
              <ExplorerLink path="tx" id={messageRequest.data.txHash} />
            </ChainEntity.Value>

            <ChainEntity.Key>Block Number</ChainEntity.Key>

            <ChainEntity.Value className={styles.blockNumber}>
              <div>
                #{messageRequest.data.blockNumber} <ExplorerLink path="block" id={messageRequest.data.blockNumber} />
              </div>

              <div>{new Date(messageRequest.data.createdAt).toLocaleString()}</div>
            </ChainEntity.Value>
          </ChainEntity.Data>
        )}

        {messageSent.data && (
          <ChainEntity.Data>
            <ChainEntity.Key>Source Program ID</ChainEntity.Key>

            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink
                hash={messageSent.data.sourceProgramId}
                href={generatePath(routes.program, { programId: messageSent.data.sourceProgramId })}
              />

              <ExplorerLink path="address" id={messageSent.data.sourceProgramId} />
            </ChainEntity.Value>

            <ChainEntity.Key>Destination</ChainEntity.Key>
            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink hash={messageSent.data.destination} />
              <ExplorerLink path="address" id={messageSent.data.destination} />
            </ChainEntity.Value>

            <ChainEntity.Key>Value</ChainEntity.Key>
            <Balance value={formatEther(BigInt(messageSent.data.value))} units="ETH" />

            <ChainEntity.Key>Is Call</ChainEntity.Key>
            <ChainEntity.Value>{String(messageSent.data.isCall)}</ChainEntity.Value>

            {messageSent.data.stateTransition && (
              <>
                <ChainEntity.Key>State Transition Hash</ChainEntity.Key>
                <HashLink hash={messageSent.data.stateTransition.hash} truncateSize="xxl" />
              </>
            )}

            <ChainEntity.Key>Created At</ChainEntity.Key>
            <ChainEntity.Value>{new Date(messageSent.data.createdAt).toLocaleString()}</ChainEntity.Value>
          </ChainEntity.Data>
        )}

        {replyRequest.data && (
          <ChainEntity.Data>
            <ChainEntity.Key>Source Address</ChainEntity.Key>

            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink hash={replyRequest.data.sourceAddress} />
              <ExplorerLink path="address" id={replyRequest.data.sourceAddress} />
            </ChainEntity.Value>

            <ChainEntity.Key>Program ID</ChainEntity.Key>

            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink
                hash={replyRequest.data.programId}
                href={generatePath(routes.program, { programId: replyRequest.data.programId })}
              />

              <ExplorerLink path="address" id={replyRequest.data.programId} />
            </ChainEntity.Value>

            <ChainEntity.Key>Value</ChainEntity.Key>
            <Balance value={formatEther(BigInt(replyRequest.data.value))} units="ETH" />

            <ChainEntity.Key>Transaction Hash</ChainEntity.Key>

            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink hash={replyRequest.data.txHash} truncateSize="xxl" />
              <ExplorerLink path="tx" id={replyRequest.data.txHash} />
            </ChainEntity.Value>

            <ChainEntity.Key>Block Number</ChainEntity.Key>

            <ChainEntity.Value className={styles.blockNumber}>
              <div>
                #{replyRequest.data.blockNumber} <ExplorerLink path="block" id={replyRequest.data.blockNumber} />
              </div>

              <div>{new Date(replyRequest.data.createdAt).toLocaleString()}</div>
            </ChainEntity.Value>
          </ChainEntity.Data>
        )}

        {replySent.data && (
          <ChainEntity.Data>
            <ChainEntity.Key>Replied To ID</ChainEntity.Key>
            <HashLink hash={replySent.data.repliedToId} truncateSize="xxl" />

            <ChainEntity.Key>Reply Code</ChainEntity.Key>
            <ChainEntity.Value>{replySent.data.replyCode}</ChainEntity.Value>

            <ChainEntity.Key>Source Program ID</ChainEntity.Key>

            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink
                hash={replySent.data.sourceProgramId}
                href={generatePath(routes.program, { programId: replySent.data.sourceProgramId })}
              />

              <ExplorerLink path="address" id={replySent.data.sourceProgramId} />
            </ChainEntity.Value>

            <ChainEntity.Key>Destination</ChainEntity.Key>
            <ChainEntity.Value className={styles.withExplorerLink}>
              <HashLink hash={replySent.data.destination} />
              <ExplorerLink path="address" id={replySent.data.destination} />
            </ChainEntity.Value>

            <ChainEntity.Key>Value</ChainEntity.Key>
            <Balance value={formatEther(BigInt(replySent.data.value))} units="ETH" />

            <ChainEntity.Key>Is Call</ChainEntity.Key>
            <ChainEntity.Value>{String(replySent.data.isCall)}</ChainEntity.Value>

            {replySent.data.stateTransition && (
              <>
                <ChainEntity.Key>State Transition Hash</ChainEntity.Key>
                <HashLink hash={replySent.data.stateTransition.hash} truncateSize="xxl" />
              </>
            )}

            <ChainEntity.Key>Created At</ChainEntity.Key>
            <ChainEntity.Value>{new Date(replySent.data.createdAt).toLocaleString()}</ChainEntity.Value>
          </ChainEntity.Data>
        )}
      </div>

      <div className={styles.column}>
        <h2 className={styles.payloadTitle}>Payload</h2>

        <div className={styles.payload}>
          {messageRequest.data?.payload ||
            messageSent.data?.payload ||
            replyRequest.data?.payload ||
            replySent.data?.payload}
        </div>
      </div>
    </PageContainer>
  );
};

export { Message };
