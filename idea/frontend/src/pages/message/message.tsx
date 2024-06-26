import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Input, Textarea, InputWrapper, Button } from '@gear-js/ui';
import { useMemo } from 'react';
import { Link, generatePath, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import cx from 'clsx';

import { useMessage } from '@/hooks';
import { useMetadata } from '@/features/metadata';
import { AnimationTimeout, absoluteRoutes } from '@/shared/config';
import { copyToClipboard, formatDate, getPreformattedText, getShortName, isUndefined } from '@/shared/helpers';
import TimestampSVG from '@/shared/assets/images/indicators/time.svg?react';
import CopySVG from '@/shared/assets/images/actions/copy.svg?react';

import { getDecodedMessagePayload } from './utils';
import { useMessageSails } from './hooks';
import styles from './message.module.scss';

type Params = {
  messageId: HexString;
};

const Message = () => {
  const { messageId } = useParams() as Params;
  const alert = useAlert();

  const { message, isLoading: isMessageLoading } = useMessage(messageId);
  const { metahash, exitCode, timestamp, id, source, value, destination, replyToMessageId, entry, blockHash } =
    message || {};

  const { metadata, isMetadataReady } = useMetadata(metahash);
  const { sails, isLoading: isSailsLoading } = useMessageSails(message);
  const isLoading = isMessageLoading || !isMetadataReady || isSailsLoading;

  const decodedPayload = useMemo(
    // eslint-disable-next-line @typescript-eslint/unbound-method
    () => (message && !isLoading ? getDecodedMessagePayload(message, metadata, sails, alert.error) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message, metadata, sails, isLoading],
  );

  const loadingClassName = cx(isLoading && styles.loading);

  return (
    <div>
      <header className={styles.header}>
        <div className={cx(styles.idSide, !isUndefined(exitCode) && (exitCode ? styles.error : styles.success))}>
          <h1 className={styles.title}>{getShortName(messageId)}</h1>
        </div>

        {timestamp && (
          <CSSTransition in appear timeout={AnimationTimeout.Default}>
            <div className={styles.timestampSide}>
              <TimestampSVG />
              <span>Timestamp:</span>
              <span className={styles.value}>{formatDate(timestamp)}</span>
            </div>
          </CSSTransition>
        )}
      </header>

      <section className={styles.messageInfo}>
        <Input value={id} label="Message ID" gap="1/6" className={loadingClassName} readOnly />
        <Input value={source} label="Source" gap="1/6" className={loadingClassName} readOnly />
        <Input value={destination} label="Destination" gap="1/6" className={loadingClassName} readOnly />
        <Input value={value} label="Value" gap="1/6" className={loadingClassName} readOnly />

        {decodedPayload && (
          <>
            {'serviceName' in decodedPayload && (
              <Input
                value={decodedPayload.serviceName}
                label="Service"
                gap="1/6"
                className={loadingClassName}
                readOnly
              />
            )}

            {'functionName' in decodedPayload && (
              <Input
                value={decodedPayload.functionName}
                label="Function"
                gap="1/6"
                className={loadingClassName}
                readOnly
              />
            )}

            <Textarea
              value={decodedPayload.value ? getPreformattedText(decodedPayload.value) : '-'}
              label="Payload"
              gap="1/6"
              className={loadingClassName}
              readOnly
              block
            />
          </>
        )}

        {entry && <Input value={entry} label="Entry" gap="1/6" className={loadingClassName} readOnly />}

        {replyToMessageId && (
          <InputWrapper label="Reply to" id="replyTo" direction="x" size="normal" gap="1/6" className={styles.link}>
            <Link to={generatePath(absoluteRoutes.message, { messageId: replyToMessageId })}>{replyToMessageId}</Link>

            <Button
              icon={CopySVG}
              color="transparent"
              className={styles.copyButton}
              onClick={() => copyToClipboard(replyToMessageId, alert)}
            />
          </InputWrapper>
        )}

        {blockHash && (
          <InputWrapper label="Block hash" id="blockHash" direction="x" size="normal" gap="1/6" className={styles.link}>
            <Link to={generatePath(absoluteRoutes.block, { blockId: blockHash })}>{blockHash}</Link>

            <Button
              icon={CopySVG}
              color="transparent"
              className={styles.copyButton}
              onClick={() => copyToClipboard(blockHash, alert)}
            />
          </InputWrapper>
        )}
      </section>
    </div>
  );
};

export { Message };
