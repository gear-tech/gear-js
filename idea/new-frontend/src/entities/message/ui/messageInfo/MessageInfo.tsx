import { useEffect, useState } from 'react';
import { Metadata } from '@gear-js/api';

import { getPreformattedText } from 'shared/helpers';
import { FormText } from 'shared/ui/form';

import styles from './MessageInfo.module.scss';
import { IMessage } from '../../model';
import { getDecodedMessagePayload } from '../../helpers';

type Props = {
  message?: IMessage;
  metadata?: Metadata;
  isLoading: boolean;
};

const MessageInfo = ({ metadata, message, isLoading }: Props) => {
  const { id, source, value, destination } = message ?? {};

  const [decodedPayload, setDecodedPayload] = useState<string>();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!message) {
      setDecodedPayload('');

      return;
    }

    const payload = metadata && !message.exitCode ? getDecodedMessagePayload(metadata, message) : message.payload;

    setDecodedPayload(payload ? getPreformattedText(payload) : '-');
  }, [metadata, message, isLoading]);

  const isPayloadLoading = decodedPayload === undefined || isLoading;

  return (
    <section className={styles.messageInfo}>
      <FormText text={id} label="Message ID" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={source} label="Source" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={value} label="Value" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={destination} label="Destination" isLoading={isPayloadLoading} className={styles.text} />
      <FormText text={decodedPayload} label="Payload" isLoading={isPayloadLoading} isTextarea className={styles.text} />
    </section>
  );
};

export { MessageInfo };
