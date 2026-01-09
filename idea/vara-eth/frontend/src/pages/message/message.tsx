import { HexString } from '@vara-eth/api';
import { generatePath, useParams } from 'react-router-dom';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import { BackButton, ExplorerLink, HashLink, PageContainer } from '@/components';
import { useGetMessageRequestsByIdQuery, useGetMessageSentByIdQuery } from '@/features/messages';
import { routes } from '@/shared/config';
import { cx, getTruncatedText } from '@/shared/utils';

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
              {/* TODO: what entity is it? can we link it? */}
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

            {/* TODO: decode payload */}
            <h2 className={styles.title}>Payload</h2>
            <div>{getTruncatedText(messageRequest.data.payload)}</div>

            {/* TODO: what decimals and symbol? */}
            <h2 className={styles.title}>Value</h2>
            <div className={styles.value}>{messageRequest.data.value}</div>

            <h2 className={styles.title}>Call Reply</h2>
            <div>{String(messageRequest.data.callReply)}</div>

            <h2 className={styles.title}>Transaction Hash</h2>

            <div className={styles.withExplorerLink}>
              <HashLink hash={messageRequest.data.txHash} />
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
              {/* TODO: what entity is it? can we link it? */}
              <HashLink hash={messageSent.data.destination} />
              <ExplorerLink path="address" id={messageSent.data.destination} />
            </div>

            {/* TODO: decode payload */}
            <h2 className={styles.title}>Payload</h2>
            <div>{getTruncatedText(messageSent.data.payload)}</div>

            <h2 className={styles.title}>Value</h2>
            <div className={styles.value}>{messageSent.data.value}</div>

            <h2 className={styles.title}>Is Call</h2>
            <div>{String(messageSent.data.isCall)}</div>

            {/* TODO: what entity is it? can we link it? */}
            <h2 className={styles.title}>State Transition ID</h2>
            <HashLink hash={messageSent.data.stateTransitionId} />

            {/* TODO: might be related to stateTransition? */}
            <h2 className={styles.title}>Created At</h2>
            <div>{new Date(messageSent.data.createdAt).toLocaleString()}</div>
          </div>
        )}
      </div>

      {/* TODO: what should be here? */}
      <div />
    </PageContainer>
  );
};

export { Message };
