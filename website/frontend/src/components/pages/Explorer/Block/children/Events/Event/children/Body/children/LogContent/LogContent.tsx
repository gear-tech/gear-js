import React, { ChangeEvent, useEffect, useState } from 'react';
import { CreateType, getWasmMetadata, Metadata, LogData } from '@gear-js/api';
import { isHex } from '@polkadot/util';
import { Codec } from '@polkadot/types/types';
import { ProgramModel } from 'types/program';
import { programService } from 'services/ProgramsRequestService';
import { getLocalProgram, isDevChain } from 'helpers';
import { TypeKey } from 'types/explorer';
import { Checkbox } from 'common/components/Checkbox/Checkbox';
import { Pre } from '../Pre/Pre';
import styles from './LogContent.module.scss';

type Props = {
  data: LogData;
};

const LogContent = ({ data }: Props) => {
  const { payload, source } = data;
  const formattedData = data.toHuman();

  const [program, setProgram] = useState<ProgramModel>();
  const [metadata, setMetadata] = useState<Metadata>();
  const [isDecodedPayload, setIsDecodedPayload] = useState(false);
  const [decodedPayload, setDecodedPayload] = useState<Codec>();

  const [error, setError] = useState('');
  const isError = !!error;

  // check if manual decoding needed,
  // cuz data.toHuman() decodes payload without metadata by itself
  const formattedPayload = payload.toHuman();
  const isFormattedPayloadHex = isHex(formattedPayload);

  const handlePayloadDecoding = (typeKey: TypeKey, errorCallback: () => void) => {
    if (metadata) {
      const type = metadata[typeKey];

      if (type) {
        try {
          setDecodedPayload(CreateType.decode(type, payload, metadata));
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
    if (isFormattedPayloadHex) {
      const { fetchProgram } = programService;
      const getProgram = isDevChain() ? getLocalProgram : fetchProgram;
      const id = source.toString();

      getProgram(id).then(({ result }) => {
        // there's a warning if the component is unmounted before program is fetched,
        // but there's nothing wrong and warn no longer be present in the next React version
        // source: https://github.com/facebook/react/pull/22114
        setProgram(result);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (program) {
      const { metaFile } = program.meta || {};

      if (metaFile) {
        const metaBuffer = Buffer.from(metaFile, 'base64');
        getWasmMetadata(metaBuffer).then(setMetadata);
      } else {
        handleInitPayloadDecoding();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  useEffect(() => {
    if (metadata) {
      handleOutputPayloadDecoding();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const handleCheckboxChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setIsDecodedPayload(checked);
  };

  const getDecodedPayloadData = () => {
    // is there a better way to get logData with replaced payload?
    const [dataObject] = formattedData as [{}];
    return [{ ...dataObject, payload: decodedPayload?.toHuman() }];
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
      <Pre text={isDecodedPayload ? getDecodedPayloadData() : formattedData} />
    </>
  );
};

export { LogContent };
