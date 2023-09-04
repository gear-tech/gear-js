import { Checkbox } from '@gear-js/ui';
import { Codec } from '@polkadot/types/types';
import { isHex } from '@polkadot/util';
import { useEffect, useState } from 'react';

import { PreformattedBlock } from 'shared/ui/preformattedBlock';
import { useMetadata } from 'features/metadata';
import { useMessage } from 'hooks';
import { isNullOrUndefined } from 'shared/helpers';

import { FormattedReplyMessageData } from '../../types';
import styles from './reply-message-body.module.scss';

type TypeKey = 'reply';

type Props = {
  data: FormattedReplyMessageData;
};

const ReplyMessageBody = ({ data }: Props) => {
  const { payload, replyToId } = data;
  // check if manual decoding is needed, cuz .toHuman() can decode payload w/out metadata
  const isFormattedPayloadHex = isHex(payload);

  const [error, setError] = useState('');
  const isError = !!error;

  const [decodedPayload, setDecodedPayload] = useState<Codec>();
  const [isDecodedPayload, setIsDecodedPayload] = useState(false);

  const { message } = useMessage(isFormattedPayloadHex ? replyToId : undefined);
  const { metadata, isMetadataReady } = useMetadata(message?.program?.metahash);

  const handlePayloadDecoding = (typeKey: TypeKey, errorCallback: () => void) => {
    if (!metadata) return;

    const type = metadata.types[typeKey];

    if (isNullOrUndefined(type)) return errorCallback();

    try {
      setDecodedPayload(metadata.createType(type, payload));
    } catch {
      errorCallback();
    }
  };

  const handleInitPayloadDecoding = () => handlePayloadDecoding('reply', () => setError("Can't decode payload"));

  useEffect(() => {
    if (!isMetadataReady) return;

    handleInitPayloadDecoding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMetadataReady, metadata]);

  const handleCheckboxChange = () => setIsDecodedPayload((prevValue) => !prevValue);

  const getDecodedPayloadData = () => ({
    ...data,

    payload: decodedPayload?.toHuman(),
  });

  return (
    <>
      {isFormattedPayloadHex && (
        <div className={styles.checkbox}>
          <Checkbox
            label="Decoded payload"
            checked={isDecodedPayload}
            onChange={handleCheckboxChange}
            disabled={isError}
          />

          {isError && <p className={styles.error}>{error}</p>}
        </div>
      )}

      <PreformattedBlock text={isDecodedPayload ? getDecodedPayloadData() : data} />
    </>
  );
};

export { ReplyMessageBody };
