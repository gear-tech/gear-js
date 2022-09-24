import { Hex, Metadata } from '@gear-js/api';
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getMetadata } from 'api';
import { StateForm } from 'widgets/stateForm';

import styles from './State.module.scss';

type Params = { programId: Hex };

const State = () => {
  const { programId } = useParams() as Params;

  const metaBuffer = useRef<Buffer>();
  const [metadata, setMetadata] = useState<Metadata>();

  useEffect(() => {
    getMetadata(programId).then(({ result }) => {
      const parsedMeta = JSON.parse(result.meta) as Metadata;

      metaBuffer.current = Buffer.from(result.metaFile, 'base64');
      setMetadata(parsedMeta);
    });
  }, [programId]);

  const isLoading = !metadata || !metaBuffer.current;

  return (
    <>
      <h2 className={styles.heading}>Read state</h2>
      <StateForm meta={metadata} programId={programId} metaBuffer={metaBuffer.current} isLoading={isLoading} />
    </>
  );
};

export { State };
