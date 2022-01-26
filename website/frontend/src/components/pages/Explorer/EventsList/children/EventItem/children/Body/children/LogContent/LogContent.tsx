import React, { ChangeEvent, useEffect, useState } from 'react';
import clsx from 'clsx';
import { CreateType, getWasmMetadata, Metadata, LogData } from '@gear-js/api';
import { Codec } from '@polkadot/types/types';
import { ProgramModel } from 'types/program';
import { programService } from 'services/ProgramsRequestService';
import { getLocalProgram, getPreformattedText, isDevChain } from 'helpers';
import { Checkbox } from 'common/components/Checkbox/Checkbox';
import eventStyles from '../../../../EventItem.module.scss';
import bodyStyles from '../../Body.module.scss';
import styles from './LogContent.module.scss';

const commonStyles = { ...bodyStyles, ...eventStyles };

type Props = {
  data: LogData;
};

const LogContent = ({ data }: Props) => {
  const [program, setProgram] = useState<ProgramModel>();
  const [metadata, setMetadata] = useState<Metadata>();
  const [isDecodedPayload, setIsDecodedPayload] = useState(false);
  const [decodedPayload, setDecodedPayload] = useState<Codec>();
  const [error, setError] = useState('');

  const { payload, source } = data;
  const isError = !!error;

  const getDecodedPayloadData = () => {
    // is there a better way to get logData with replaced payload?
    const [dataObject] = data.toHuman() as [{}];
    return [{ ...dataObject, payload: decodedPayload?.toHuman() }];
  };

  const preClassName = clsx(commonStyles.text, commonStyles.pre);
  const formattedData = getPreformattedText(isDecodedPayload ? getDecodedPayloadData() : data.toHuman());

  const fetchProgram = (id: string) => {
    const getProgram = isDevChain() ? getLocalProgram : programService.fetchProgram;
    return getProgram(id);
  };

  // TODO: 'handle_output' | 'init_output' to enum
  const handlePayloadDecoding = (errorCallback: () => void, typeKey?: 'handle_output' | 'init_output') => {
    const type = metadata && typeKey ? metadata[typeKey] : 'Bytes';

    if (type) {
      try {
        setDecodedPayload(CreateType.decode(type, payload, metadata));
      } catch {
        errorCallback();
      }
    } else {
      errorCallback();
    }
  };

  const setDecodingError = () => {
    setError("Can't decode payload");
  };

  const handleBytesPayloadDecoding = () => {
    handlePayloadDecoding(setDecodingError);
  };

  useEffect(() => {
    const programId = source.toString();

    fetchProgram(programId)
      .then(({ result }) => {
        // there's a warning if the component is unmounted before program is fetched,
        // but there's nothing wrong and warn no longer be present in the next React version
        // source: https://github.com/facebook/react/pull/22114
        setProgram(result);
      })
      .catch(() => {
        handleBytesPayloadDecoding();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (program) {
      const { metaFile } = program.meta || {};

      if (metaFile) {
        const metaBuffer = Buffer.from(metaFile, 'base64');
        getWasmMetadata(metaBuffer).then(setMetadata);
      } else {
        handleBytesPayloadDecoding();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  const handleInitPayloadDecoding = () => {
    handlePayloadDecoding(handleBytesPayloadDecoding, 'init_output');
  };

  useEffect(() => {
    if (metadata) {
      handlePayloadDecoding(handleInitPayloadDecoding, 'handle_output');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const handleCheckboxChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setIsDecodedPayload(checked);
  };

  return (
    <>
      <div className={styles.checkbox}>
        <Checkbox
          label="Decoded payload"
          checked={isDecodedPayload}
          onChange={handleCheckboxChange}
          disabled={isError}
        />
        {isError && <p className={styles.error}>{error}</p>}
      </div>
      <pre className={preClassName}>{formattedData}</pre>
    </>
  );
};

export { LogContent };
