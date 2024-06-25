import { CreateType, HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Input, Textarea, InputWrapper, Button } from '@gear-js/ui';
import { AnyJson, Codec } from '@polkadot/types/types';
import { useState, useEffect } from 'react';
import { Link, generatePath, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import cx from 'clsx';

import { useMessage } from '@/hooks';
import { useMetadata } from '@/features/metadata';
import { getDecodedMessagePayload } from '@/features/message';
import { AnimationTimeout, absoluteRoutes } from '@/shared/config';
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

  const { message, isLoading: isMessageLoading } = useMessage(messageId);
  const { metahash, exitCode, timestamp, id, source, value, destination, replyToMessageId, entry, blockHash } =
    message || {};

  const { metadata, isMetadataReady } = useMetadata(metahash);
  const isLoading = isMessageLoading || !isMetadataReady;

  const [decodedPayload, setDecodedPayload] = useState<string>();

  useEffect(() => {
    if (isLoading) return;
    if (!message) return setDecodedPayload('');

    let payload: AnyJson | Codec;

    try {
      if (!message.exitCode) {
        payload = metadata
          ? getDecodedMessagePayload(metadata, message)
          : CreateType.create('Bytes', message.payload).toHuman();
      } else {
        payload = CreateType.create('String', message.payload).toHuman();
      }
    } catch (error) {
      alert.error(String(error));

      payload = message.payload;
    }

    setDecodedPayload(payload ? getPreformattedText(payload) : '-');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, message, isLoading]);

  const isPayloadLoading = decodedPayload === undefined || isLoading;
  const loadingClassName = cx(isPayloadLoading && styles.loading);

  return (
    <div>
      <header className={styles.header}>
        <div className={cx(styles.idSide, exitCode !== undefined && (exitCode ? styles.error : styles.success))}>
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
        <Textarea value={decodedPayload} label="Payload" gap="1/6" className={loadingClassName} readOnly block />

        {entry && <Input value={entry} label="Entry" gap="1/6" className={loadingClassName} readOnly />}

        {!isPayloadLoading && replyToMessageId && (
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

        {!isPayloadLoading && blockHash && (
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
