import { UserMessageSentData } from '@gear-js/api';
import { Checkbox } from '@gear-js/ui';
import { Codec } from '@polkadot/types/types';
import { isHex } from '@polkadot/util';
import { useEffect, useState } from 'react';

import { PreformattedBlock } from 'shared/ui/preformattedBlock';
import { useMetadata } from 'features/metadata';
import { useProgram } from 'hooks';
import { isNullOrUndefined } from 'shared/helpers';

import { FormattedUserMessageSentData } from '../../types';
import styles from './log.module.scss';

type TypeKey = 'handle' | 'init';

type Props = {
  data: UserMessageSentData;
};

const Log = ({ data }: Props) => {
  const { payload, source } = data.message;
  const formattedData = data.toHuman() as FormattedUserMessageSentData;
  // check if manual decoding is needed, cuz .toHuman() can decode payload w/out metadata
  const isFormattedPayloadHex = isHex(formattedData.message.payload);

  const [error, setError] = useState('');
  const isError = !!error;

  const [decodedPayload, setDecodedPayload] = useState<Codec>();
  const [isDecodedPayload, setIsDecodedPayload] = useState(false);

  const { program } = useProgram(isFormattedPayloadHex ? source.toHex() : undefined);
  const { metadata, isMetadataReady } = useMetadata(program?.metahash);

  const handlePayloadDecoding = (typeKey: TypeKey, errorCallback: () => void) => {
    if (!metadata) return;

    const type = metadata.types[typeKey].output;

    if (isNullOrUndefined(type)) return errorCallback();

    try {
      setDecodedPayload(metadata.createType(type, payload));
    } catch {
      errorCallback();
    }
  };

  const handleInitPayloadDecoding = () => handlePayloadDecoding('init', () => setError("Can't decode payload"));
  const handleOutputPayloadDecoding = () => handlePayloadDecoding('handle', handleInitPayloadDecoding);

  useEffect(() => {
    if (!isMetadataReady) return;
    if (!metadata) return handleInitPayloadDecoding();

    handleOutputPayloadDecoding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMetadataReady, metadata]);

  const handleCheckboxChange = () => setIsDecodedPayload((prevValue) => !prevValue);

  const getDecodedPayloadData = () => ({
    ...formattedData,

    message: {
      ...formattedData.message,
      payload: decodedPayload?.toHuman(),
    },
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

      <PreformattedBlock text={isDecodedPayload ? getDecodedPayloadData() : formattedData} />
    </>
  );
};

export { Log };
