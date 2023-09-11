import { CreateType, ProgramMetadata } from '@gear-js/api';
import { Button, Input, InputWrapper, Textarea } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { AnyJson, Codec } from '@polkadot/types/types';
import { useEffect, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import cx from 'clsx';

import { copyToClipboard, getPreformattedText } from 'shared/helpers';
import { absoluteRoutes } from 'shared/config';
import { ReactComponent as CopySVG } from 'shared/assets/images/actions/copy.svg';

import { IMessage } from '../../model';
import { getDecodedMessagePayload } from '../../helpers';
import styles from './MessageInfo.module.scss';

type Props = {
  message?: IMessage;
  metadata?: ProgramMetadata;
  isLoading: boolean;
};

const MessageInfo = ({ metadata, message, isLoading }: Props) => {
  const { id, source, value, destination, replyToMessageId, entry, blockHash } = message || {};

  const alert = useAlert();

  const [decodedPayload, setDecodedPayload] = useState<string>();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!message) {
      setDecodedPayload('');

      return;
    }

    let payload: AnyJson | Codec;

    try {
      if (!message.exitCode) {
        if (metadata) {
          payload = getDecodedMessagePayload(metadata, message);
        } else {
          payload = CreateType.create('Bytes', message.payload).toHuman();
        }
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
  );
};

export { MessageInfo };
