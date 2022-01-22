import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateType, getWasmMetadata, Metadata, LogData } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { RootState } from 'store/reducers';
import { getProgramAction, resetProgramAction } from 'store/actions/actions';
import { Checkbox } from 'common/components/Checkbox/Checkbox';
import clsx from 'clsx';
import styles from './Body.module.scss';
import commonStyles from '../../EventItem.module.scss';

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

  const setDecodedLogPayload = (type: string) => {
    if (logData) {
      const { payload } = logData;
      setDecodedPayload(CreateType.decode(type, payload, metadata));
    }
  };

  useEffect(() => {
    if (metadata) {
      const { handle_output: metaHandleOutput, init_output: metaInitOutput } = metadata;

      if (metaHandleOutput) {
        try {
          setDecodedLogPayload(metaHandleOutput);
        } catch {
          if (metaInitOutput) {
            setDecodedLogPayload(metaInitOutput);
          }
        }
      }
    }
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
