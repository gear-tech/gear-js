import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Input, Textarea, InputWrapper, Button } from '@gear-js/ui';
import { useMemo } from 'react';
import { Link, generatePath, useParams } from 'react-router-dom';
import cx from 'clsx';

import {
  getDecodedMessagePayload,
  isMessageWithError,
  useMessageFromProgram,
  useMessageToProgram,
} from '@/features/message';
import { useProgram } from '@/features/program';
import { useMetadata } from '@/features/metadata';
import { useSails } from '@/features/sails';
import { absoluteRoutes, routes } from '@/shared/config';
import { copyToClipboard, formatDate, getPreformattedText, getShortName } from '@/shared/helpers';
import TimestampSVG from '@/shared/assets/images/indicators/time.svg?react';
import CopySVG from '@/shared/assets/images/actions/copy.svg?react';

import styles from './message.module.scss';

type Params = {
  messageId: HexString;
};

const Message = () => {
  const { messageId } = useParams() as Params;
  const alert = useAlert();

  const messageToProgram = useMessageToProgram(messageId);
  const messageFromProgram = useMessageFromProgram(messageId);

  const message = messageToProgram.data || messageFromProgram.data;
  const isLoading = messageToProgram.isLoading || messageFromProgram.isLoading;
  const { timestamp, id, source, value, destination, replyToMessageId, blockHash, service, fn } = message || {};

  const { data: program } = useProgram(messageToProgram.data ? destination : source);
  const { metadata, isMetadataReady } = useMetadata(program?.metahash);
  const { sails, isLoading: isSailsLoading } = useSails(program?.codeId);
  const isPayloadLoading = !isMetadataReady || isSailsLoading;

  const decodedPayload = useMemo(
    () =>
      message && !isPayloadLoading
        ? // eslint-disable-next-line @typescript-eslint/unbound-method
          getDecodedMessagePayload(message, Boolean(messageToProgram.data), metadata, sails, alert.error)
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message, metadata, sails, isPayloadLoading],
  );

  const inputClassName = cx(isLoading && styles.loading);
  const payloadClassName = cx(isPayloadLoading && styles.loading);

  return (
    <div>
      <header className={styles.header}>
        <div className={cx(styles.idSide, message && isMessageWithError(message) ? styles.error : styles.success)}>
          <h1 className={styles.title}>{getShortName(messageId)}</h1>
        </div>

        {timestamp && (
          <div className={styles.timestampSide}>
            <TimestampSVG />
            <span>Timestamp:</span>
            <span className={styles.value}>{formatDate(timestamp)}</span>
          </div>
        )}
      </header>

      <section className={styles.messageInfo}>
        <Input value={id} label="Message ID" gap="1/6" className={inputClassName} readOnly />
        <Input value={source} label="Source" gap="1/6" className={inputClassName} readOnly />
        <Input value={destination} label="Destination" gap="1/6" className={inputClassName} readOnly />
        <Input value={value} label="Value" gap="1/6" className={inputClassName} readOnly />

        {service && <Input value={service} label="Service" gap="1/6" className={inputClassName} readOnly />}
        {fn && <Input value={fn} label="Function" gap="1/6" className={inputClassName} readOnly />}

        <Textarea
          value={decodedPayload ? getPreformattedText(decodedPayload) : '-'}
          label="Payload"
          gap="1/6"
          className={payloadClassName}
          readOnly
          block
        />

        {message && 'entry' in message && message.entry && (
          <Input value={message.entry} label="Entry" gap="1/6" className={inputClassName} readOnly />
        )}

        {replyToMessageId && (
          <InputWrapper label="Reply to" id="replyTo" direction="x" size="normal" gap="1/6" className={styles.link}>
            <Link to={generatePath(routes.message, { messageId: replyToMessageId })}>{replyToMessageId}</Link>

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
