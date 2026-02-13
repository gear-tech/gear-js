import { useParams } from 'react-router-dom';
import { Hex } from 'viem';

import { ChainEntity, PageContainer, Skeleton } from '@/components';
import {
  MessageData,
  useGetMessageRequestByIdQuery,
  useGetMessageSentByIdQuery,
  useGetReplyRequestByIdQuery,
  useGetReplySentByIdQuery,
} from '@/features/messages';
import { cx } from '@/shared/utils';

import ArrowSVG from './arrow.svg?react';
import styles from './message.module.scss';

type Params = {
  messageId: Hex;
};

const Message = () => {
  const { messageId } = useParams() as Params;

  const messageRequest = useGetMessageRequestByIdQuery(messageId);
  const messageSent = useGetMessageSentByIdQuery(messageId);
  const replyRequest = useGetReplyRequestByIdQuery(messageId);
  const replySent = useGetReplySentByIdQuery(messageId);

  if (messageRequest.isLoading || messageSent.isLoading || replyRequest.isLoading || replySent.isLoading) {
    return (
      <PageContainer className={styles.container}>
        <div className={styles.column}>
          <ChainEntity.Header>
            <ChainEntity.BackButton />

            <div className={styles.title}>
              <Skeleton width="16px" />
              <ChainEntity.Title id={messageId} />
            </div>
          </ChainEntity.Header>

          <MessageData.Skeleton />
        </div>

        <div className={styles.column}>
          <h2 className={styles.payloadTitle}>Payload</h2>
          <Skeleton height="4rem" />
        </div>
      </PageContainer>
    );
  }

  if (!messageRequest.data && !messageSent.data && !replyRequest.data && !replySent.data)
    return <ChainEntity.NotFound entity="message" id={messageId} />;

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

        {messageRequest.data && <MessageData.Request {...messageRequest.data} />}
        {messageSent.data && <MessageData.Sent {...messageSent.data} />}
        {replyRequest.data && <MessageData.ReplyRequest {...replyRequest.data} />}
        {replySent.data && <MessageData.ReplySent {...replySent.data} />}
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
