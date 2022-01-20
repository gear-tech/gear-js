import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWasmMetadata, Metadata } from '@gear-js/api';
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

  const preClassName = clsx(commonStyles.text, styles.pre);
  const formattedData = JSON.stringify(data, null, 2);

  useEffect(() => {
    if (method === 'Log') {
      // TODO: figure out types, since data[0] is just Codec
      const logData = data[0] as unknown as LogData;
      const programId = logData.source.toString();

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

  console.log(metadata);

  return (
    <div className={styles.body}>
      <pre className={preClassName}>{formattedData}</pre>
    </div>
  );
};

export { Body };
