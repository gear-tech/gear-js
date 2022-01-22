import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateType, getWasmMetadata, Metadata, LogData } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { RootState } from 'store/reducers';
import { AddAlert, getProgramAction, resetProgramAction } from 'store/actions/actions';
import { Checkbox } from 'common/components/Checkbox/Checkbox';
import clsx from 'clsx';
import styles from './Body.module.scss';
import commonStyles from '../../EventItem.module.scss';
import { EventTypes } from 'types/events';

type Props = {
  method: string;
  data: GenericEventData;
};

const selectProgram = (state: RootState) => state.programs.program;

const Body = ({ method, data }: Props) => {
  const dispatch = useDispatch();
  const program = useSelector(selectProgram);

  const isLog = method === 'Log';
  const logData = isLog ? new LogData(data) : undefined;
  const [metadata, setMetadata] = useState<Metadata>();
  const [isDecodedPayload, setIsDecodedPayload] = useState(false);
  const [decodedPayload, setDecodedPayload] = useState<Codec>();

  const getDecodedPayloadData = () => {
    // is there a better way to get logData with replaced payload?
    const [dataObject] = data.toJSON() as [{}];
    return [{ ...dataObject, payload: decodedPayload }];
  };

  const preClassName = clsx(commonStyles.text, styles.pre);
  const formattedData = JSON.stringify(isDecodedPayload ? getDecodedPayloadData() : data, null, 2);

  useEffect(() => {
    if (logData) {
      const { source } = logData;
      const programId = source.toString();

      dispatch(getProgramAction(programId));
    }

    return () => {
      dispatch(resetProgramAction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // TODO: getting of metadata is the same as in the State component (prolly somewhere else too)
    const metaFile = program?.meta?.metaFile;

    if (metaFile) {
      const metaBuffer = Buffer.from(metaFile, 'base64');
      getWasmMetadata(metaBuffer).then(setMetadata);
    }
  }, [program]);

  // TODO: 'handle_output' | 'init_output' to enum
  const handlePayloadDecoding = (typeKey: 'handle_output' | 'init_output', errorCallback: () => void) => {
    if (logData && metadata) {
      const { payload } = logData;
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

  const showDecodingError = () => {
    const message = "Can't decode payload neither by handle_output, nor init_output type";
    const alert = { type: EventTypes.ERROR, message };
    dispatch(AddAlert(alert));
  };

  const handleInitPayloadDecoding = () => {
    handlePayloadDecoding('init_output', showDecodingError);
  };

  useEffect(() => {
    handlePayloadDecoding('handle_output', handleInitPayloadDecoding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const handleCheckboxChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setIsDecodedPayload(checked);
  };

  return (
    <div className={styles.body}>
      {isLog && (
        <Checkbox
          label="Decoded payload"
          className={styles.checkbox}
          checked={isDecodedPayload}
          onChange={handleCheckboxChange}
        />
      )}
      <pre className={preClassName}>{formattedData}</pre>
    </div>
  );
};

export { Body };
