import { ChangeEvent, useEffect, useState } from 'react';
import { CreateType, UserMessageSentData } from '@gear-js/api';
import { Checkbox } from '@gear-js/ui';
import { Codec } from '@polkadot/types/types';
import { isHex } from '@polkadot/util';

import { PreformattedBlock } from 'shared/ui/preformattedBlock';
import { useMetadata } from 'features/metadata';

import styles from './Log.module.scss';

type TypeKey = 'handle_output' | 'init_output';

type Props = {
  data: UserMessageSentData;
};

const Log = ({ data }: Props) => {
  const { payload, source } = data.message;
  const formattedData = data.toHuman();

  const [error, setError] = useState('');
  const [decodedPayload, setDecodedPayload] = useState<Codec>();
  const [isDecodedPayload, setIsDecodedPayload] = useState(false);

  const isError = !!error;
  // check if manual decoding needed,
  // cuz data.toHuman() decodes payload without metadata by itself
  const formattedPayload = payload.toHuman();
  const isFormattedPayloadHex = isHex(formattedPayload);

  const { metadata, isMetadataReady } = useMetadata(isFormattedPayloadHex ? source.toHex() : undefined);

  const handlePayloadDecoding = (typeKey: TypeKey, errorCallback: () => void) => {
    if (!metadata) return;

    // TODO:
    // const type = metadata[typeKey];
    const type = '';

    if (!type) return errorCallback();

    try {
      // setDecodedPayload(CreateType.create(type, payload, metadata));
    } catch {
      errorCallback();
    }
  };

  const setDecodingError = () => {
    setError("Can't decode payload");
  };

  const handleInitPayloadDecoding = () => {
    handlePayloadDecoding('init_output', setDecodingError);
  };

  const handleOutputPayloadDecoding = () => {
    handlePayloadDecoding('handle_output', handleInitPayloadDecoding);
  };

  useEffect(() => {
    if (!isMetadataReady) return;

    if (metadata) {
      handleOutputPayloadDecoding();
    } else {
      handleInitPayloadDecoding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMetadataReady, metadata]);

  const handleCheckboxChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setIsDecodedPayload(checked);
  };

  const getDecodedPayloadData = () => {
    // is there a better way to get logData with replaced payload?
    const { message, expiration } = formattedData as { message: {}; expiration: string };

    return { message: { ...message, payload: decodedPayload?.toHuman() }, expiration };
  };

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
      <PreformattedBlock text={isDecodedPayload ? getDecodedPayloadData() : formattedData} />
    </>
  );
};

export { Log };
