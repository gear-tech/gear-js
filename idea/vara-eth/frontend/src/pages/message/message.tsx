import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Hex } from 'viem';

import { ChainEntity, PageContainer, Skeleton, Tabs } from '@/components';
import {
  getDecodedPayload,
  getMessageRoute,
  MessageData,
  useGetInjectedTransactionByIdQuery,
  useGetMessageRequestByIdQuery,
  useGetMessageSentByIdQuery,
  useGetReplyRequestByIdQuery,
  useGetReplySentByIdQuery,
  useGetReplySentsByRepliedToIdQuery,
} from '@/features/messages';
import { useGetProgramByIdQuery } from '@/features/programs';
import { useSails } from '@/features/sails';
import { useIdlStorage } from '@/shared/hooks';
import { cx, getPreformattedText } from '@/shared/utils';

import ArrowSVG from './arrow.svg?react';
import styles from './message.module.scss';

type Params = {
  messageId: Hex;
};

const Message = () => {
  const { messageId } = useParams() as Params;
  const [tabIndex, setTabIndex] = useState(0);

  const messageRequest = useGetMessageRequestByIdQuery(messageId);
  const messageSent = useGetMessageSentByIdQuery(messageId);
  const replyRequest = useGetReplyRequestByIdQuery(messageId);
  const replySent = useGetReplySentByIdQuery(messageId);
  const injectedTransaction = useGetInjectedTransactionByIdQuery(messageId);

  const isInjected = Boolean(
    injectedTransaction.data &&
      !messageRequest.data &&
      !messageSent.data &&
      !replyRequest.data &&
      !replySent.data,
  );

  const replySents = useGetReplySentsByRepliedToIdQuery(messageId, { enabled: isInjected });

  const sourceProgramId =
    messageRequest.data?.programId ||
    replyRequest.data?.programId ||
    messageSent.data?.sourceProgramId ||
    replySent.data?.sourceProgramId ||
    injectedTransaction.data?.destination;
  const { data: sourceProgram, isLoading: isSourceProgramLoading } = useGetProgramByIdQuery(sourceProgramId ?? '');
  const { idl, isLoading: isIdlLoading } = useIdlStorage(sourceProgram?.code?.id);
  const { data: sails, isLoading: isSailsLoading } = useSails(idl);

  const payload =
    messageRequest.data?.payload ||
    messageSent.data?.payload ||
    replyRequest.data?.payload ||
    replySent.data?.payload ||
    injectedTransaction.data?.payload;

  const isDecodedPayloadLoading =
    Boolean(payload && sourceProgramId) && (isSourceProgramLoading || isIdlLoading || isSailsLoading);

  const decodedPayload = useMemo(() => (payload ? getDecodedPayload(payload, sails) : null), [payload, sails]);
  const messageRoute = useMemo(() => (payload ? getMessageRoute(payload, sails) : null), [payload, sails]);

  const isLoading =
    messageRequest.isLoading ||
    messageSent.isLoading ||
    replyRequest.isLoading ||
    replySent.isLoading ||
    injectedTransaction.isLoading ||
    isDecodedPayloadLoading ||
    (isInjected && replySents.isLoading);

  const hasEntity =
    messageRequest.data ||
    messageSent.data ||
    replyRequest.data ||
    replySent.data ||
    injectedTransaction.data;

  if (isLoading) {
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
          <div className={styles.payloadHeader}>
            <h2 className={styles.payloadTitle}>Payload</h2>
            <Tabs
              tabs={['Decoded', 'Raw']}
              tabIndex={tabIndex}
              onTabIndexChange={setTabIndex}
              className={styles.payloadTabs}
            />
          </div>
          <Skeleton height="4rem" />
        </div>
      </PageContainer>
    );
  }

  if (!hasEntity) return <ChainEntity.NotFound entity="message" id={messageId} />;

  return (
    <PageContainer className={styles.container}>
      <div className={styles.column}>
        <ChainEntity.Header>
          <ChainEntity.BackButton />

          <div className={styles.title}>
            <ArrowSVG className={cx(styles.arrow, (messageSent.data || isInjected) && styles.from)} />
            <ChainEntity.Title id={messageId} />
          </div>
        </ChainEntity.Header>

        {messageRequest.data && <MessageData.Request {...messageRequest.data} route={messageRoute} />}
        {messageSent.data && <MessageData.Sent {...messageSent.data} route={messageRoute} />}
        {replyRequest.data && <MessageData.ReplyRequest {...replyRequest.data} route={messageRoute} />}
        {replySent.data && <MessageData.ReplySent {...replySent.data} route={messageRoute} />}
        {injectedTransaction.data && isInjected && (
          <MessageData.Injected {...injectedTransaction.data} route={messageRoute} />
        )}

        {isInjected && (
          <section className={styles.response}>
            <h2 className={styles.responseTitle}>Response</h2>
            {replySents.isError ? (
              <p className={styles.responseEmpty}>Failed to load replies</p>
            ) : replySents.data?.data.length ? (
              replySents.data.data.map((reply) => <MessageData.ReplySent key={reply.id} {...reply} />)
            ) : (
              <p className={styles.responseEmpty}>No replies yet</p>
            )}
          </section>
        )}
      </div>

      <div className={styles.column}>
        <div className={styles.payloadHeader}>
          <h2 className={styles.payloadTitle}>Payload</h2>
          <Tabs
            tabs={['Decoded', 'Raw']}
            tabIndex={tabIndex}
            onTabIndexChange={setTabIndex}
            className={styles.payloadTabs}
          />
        </div>

        <div className={styles.payload}>
          {tabIndex === 0 ? (
            <pre>{decodedPayload ? getPreformattedText(decodedPayload) : 'Unable to decode payload'}</pre>
          ) : (
            <div>{payload}</div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export { Message };
