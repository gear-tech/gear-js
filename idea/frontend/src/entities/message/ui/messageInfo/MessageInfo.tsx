import { CreateType, Metadata } from '@gear-js/api';
import { InputWrapper } from '@gear-js/ui';
import { AnyJson, Codec } from '@polkadot/types/types';
import { useEffect, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import clsx from 'clsx';

import { getPreformattedText } from 'shared/helpers';
import { FormText } from 'shared/ui/form';
import { absoluteRoutes } from 'shared/config';

import styles from './MessageInfo.module.scss';
import { IMessage } from '../../model';
import { getDecodedMessagePayload } from '../../helpers';

type Props = {
  message?: IMessage;
  metadata?: Metadata;
  isLoading: boolean;
};

const MessageInfo = ({ metadata, message, isLoading }: Props) => {
  const { id, source, value, destination, replyToMessageId } = message ?? {};

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

    if (!message.exitCode) {
      if (metadata) {
        payload = getDecodedMessagePayload(metadata, message);
      } else {
        payload = CreateType.create('Bytes', message.payload).toHuman();
      }
    } else {
      payload = CreateType.create('String', message.payload).toHuman();
    }

    setDecodedPayload(payload ? getPreformattedText(payload) : '-');
  }, [metadata, message, isLoading]);

  const isPayloadLoading = decodedPayload === undefined || isLoading;

  return (
    <section className={styles.messageInfo}>
      <FormText text={id} label="Message ID" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={source} label="Source" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={destination} label="Destination" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={value} label="Value" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={decodedPayload} label="Payload" isLoading={isPayloadLoading} isTextarea className={styles.text} />

      {replyToMessageId && !isLoading && (
        <InputWrapper
          label="Reply To Message ID"
          id="replyTo"
          direction="x"
          size="normal"
          className={clsx(styles.text, styles.replyTo)}>
          <Link to={generatePath(absoluteRoutes.message, { messageId: replyToMessageId })}>{replyToMessageId}</Link>
        </InputWrapper>
      )}
    </section>
  );
};

export { MessageInfo };
