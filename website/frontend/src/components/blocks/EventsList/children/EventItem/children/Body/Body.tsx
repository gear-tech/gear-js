import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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

  const isLog = method === 'Log';
  // TODO: figure out types, since data[0] is just Codec
  const initLogData = isLog ? (data[0] as unknown as LogData) : undefined;
  const [logData, setLogData] = useState(initLogData);
  const [metadata, setMetadata] = useState<Metadata>();

  const preClassName = clsx(commonStyles.text, styles.pre);
  const formattedData = JSON.stringify(logData || data, null, 2);

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

      const decodedPayload = CreateType.decode(type, payload, metadata);
      setLogData((prevData) => ({ ...prevData, payload: decodedPayload }));
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

  const getLink = (path: string, id: Codec) => {
    const stringId = id.toString();
    return (
      <Link to={`/${path}/${stringId}`} className={styles.link}>
        {stringId}
      </Link>
    );
  };

  const getLine = (key: string, path: string, id: Codec) => (
    <span className={styles.line}>
      {key}
      {getLink(path, id)},
    </span>
  );

  const getParsedData = () => {
    return formattedData.split('\n').map((line) => {
      const keyRegex = /^(.*?): /g;
      const keyMatch = line.match(keyRegex);

      if (keyMatch) {
        const [keyString] = keyMatch;

        if (logData) {
          const { source, id } = logData;

          if (line.includes('source')) {
            return getLine(keyString, 'program', source);
          }

          if (line.includes('id')) {
            return getLine(keyString, 'message', id);
          }
        }
      }

      return <span className={styles.line}>{line}</span>;
    });
  };

  return (
    <div className={styles.body}>
      <pre className={preClassName}>{isLog ? getParsedData() : formattedData}</pre>
    </div>
  );
};

export { Body };
