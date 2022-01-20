import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateType, getWasmMetadata, Metadata } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { RootState } from 'store/reducers';
import { getProgramAction, resetProgramAction } from 'store/actions/actions';
import clsx from 'clsx';
import styles from './Body.module.scss';
import commonStyles from '../../EventItem.module.scss';

type Props = {
  method: string;
  data: GenericEventData;
};

type LogData = {
  [key: string]: Codec;
};

const selectProgram = (state: RootState) => state.programs.program;

const Body = ({ method, data }: Props) => {
  const dispatch = useDispatch();
  const program = useSelector(selectProgram);
  const [metadata, setMetadata] = useState<Metadata>();
  const metaBuffer = useRef<Buffer>();

  // TODO: figure out types, since data[0] is just Codec
  const logData = data[0] as unknown as LogData;
  const { source, payload } = logData;

  const preClassName = clsx(commonStyles.text, styles.pre);
  const formattedData = JSON.stringify(data, null, 2);

  useEffect(() => {
    if (method === 'Log') {
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
      metaBuffer.current = Buffer.from(metaFile, 'base64');
      getWasmMetadata(metaBuffer.current).then(setMetadata);
    }
  }, [program]);

  useEffect(() => {
    if (metadata) {
      if (metadata.handle_output) {
        try {
          const decodedPayload = CreateType.decode(metadata.handle_output, payload, metadata);
          console.log('handle output, try');
          console.log(decodedPayload);
        } catch {
          if (metadata.init_output) {
            const decodedPayload = CreateType.decode(metadata.init_output, payload, metadata);
            console.log('init_output, catch');
            console.log(decodedPayload);
          }
        }
      }
    }
  }, [metadata, payload]);

  console.log(metadata);

  return (
    <div className={styles.body}>
      <pre className={preClassName}>{formattedData}</pre>
    </div>
  );
};

export { Body };
