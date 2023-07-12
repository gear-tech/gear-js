import { CreateType, ProgramMetadata } from '@gear-js/api';
import { InputWrapper } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
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
  metadata?: ProgramMetadata;
  isLoading: boolean;
};

const MessageInfo = ({ metadata, message, isLoading }: Props) => {
  const { id, source, value, destination, replyToMessageId, entry } = message ?? {};

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

  return (
    <section className={styles.messageInfo}>
      <FormText text={id} label="Message ID" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={source} label="Source" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={destination} label="Destination" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={value} label="Value" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={decodedPayload} label="Payload" isLoading={isPayloadLoading} isTextarea className={styles.text} />

      {!isPayloadLoading && (
        <>
          {entry && <FormText text={entry} label="Entry" className={styles.text} />}
          {replyToMessageId && (
            <InputWrapper
              label="Reply To Message ID"
              id="replyTo"
              direction="x"
              size="normal"
              className={clsx(styles.text, styles.replyTo)}>
              <Link to={generatePath(absoluteRoutes.message, { messageId: replyToMessageId })}>{replyToMessageId}</Link>
            </InputWrapper>
          )}
        </>
      )}
    </section>
  );
};

export { MessageInfo };
