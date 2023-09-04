import { Checkbox } from '@gear-js/ui';
import { Codec } from '@polkadot/types/types';
import { isHex } from '@polkadot/util';
import { HexString } from '@gear-js/api';
import { useEffect, useState } from 'react';

import { PreformattedBlock } from 'shared/ui/preformattedBlock';
import { useMetadata } from 'features/metadata';
import { useProgram } from 'hooks';
import { isNullOrUndefined } from 'shared/helpers';

import { FormattedUploadProgramMessage } from '../../types';
import styles from './upload-program-body.module.scss';

type TypeKey = 'init';

type Props = {
  data: FormattedUploadProgramMessage;
  programId: HexString | undefined;
};

const UploadProgramBody = ({ data, programId }: Props) => {
  const { initPayload: payload } = data;
  // check if manual decoding is needed, cuz .toHuman() can decode payload w/out metadata
  const isFormattedPayloadHex = isHex(payload);

  const [error, setError] = useState('');
  const isError = !!error;

  const [decodedPayload, setDecodedPayload] = useState<Codec>();
  const [isDecodedPayload, setIsDecodedPayload] = useState(false);

  const { program } = useProgram(isFormattedPayloadHex ? programId : undefined);
  const { metadata, isMetadataReady } = useMetadata(program?.metahash);

  const handlePayloadDecoding = (typeKey: TypeKey, errorCallback: () => void) => {
    if (!metadata) return;

    const type = metadata.types[typeKey].input;

    if (isNullOrUndefined(type)) return errorCallback();

    try {
      setDecodedPayload(metadata.createType(type, payload));
    } catch {
      errorCallback();
    }
  };

  const handleInitPayloadDecoding = () => handlePayloadDecoding('init', () => setError("Can't decode payload"));

  useEffect(() => {
    if (!isMetadataReady) return;

    handleInitPayloadDecoding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMetadataReady, metadata]);

  const handleCheckboxChange = () => setIsDecodedPayload((prevValue) => !prevValue);

  const getDecodedPayloadData = () => ({
    ...data,

    initPayload: decodedPayload?.toHuman(),
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

export { UploadProgramBody };
