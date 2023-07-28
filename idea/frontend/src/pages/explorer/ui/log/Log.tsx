import { ChangeEvent, useEffect, useState } from 'react';
import { CreateType, UserMessageSentData } from '@gear-js/api';
import { Checkbox } from '@gear-js/ui';
import { Codec } from '@polkadot/types/types';
import { isHex } from '@polkadot/util';

import { PreformattedBlock } from 'shared/ui/preformattedBlock';
import { useProgram } from 'hooks';

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

  const { program, metadata } = useProgram(isFormattedPayloadHex ? source.toHex() : undefined);

  const handlePayloadDecoding = (typeKey: TypeKey, errorCallback: () => void) => {
    if (metadata) {
      // TODO:
      // const type = metadata[typeKey];
      const type = '';

      if (type) {
        try {
          // setDecodedPayload(CreateType.create(type, payload, metadata));
        } catch {
          errorCallback();
        }
      } else {
        errorCallback();
      }
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
    if (metadata) handleOutputPayloadDecoding();
    if (program && !metadata) handleInitPayloadDecoding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, program]);

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
