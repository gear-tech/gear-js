import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Metadata } from '@gear-js/api';

import { UploadData } from 'features/uploadMetadata';

import styles from './InitializeProgram.module.scss';
import { PageParams } from '../model';
import { CodeSection } from './codeSection';
import { MetadataSection } from './metadataSection';

const InitializeProgram = () => {
  const { codeId } = useParams() as PageParams;

  const [metadata, setMetadata] = useState<Metadata>();
  const [metadataBuffer, setMetadataBuffer] = useState<string>();

  const resetMetadada = useCallback(() => {
    setMetadata(undefined);
    setMetadataBuffer(undefined);
  }, []);

  const uploadMetadada = useCallback((data: UploadData) => {
    setMetadata(data.metadata);
    setMetadataBuffer(data.metadataBuffer);
  }, []);

  return (
    <div className={styles.initializeProgramPage}>
      <CodeSection codeId={codeId} metadata={metadata} metadataBuffer={metadataBuffer} />
      <MetadataSection metadata={metadata} onReset={resetMetadada} onUpload={uploadMetadada} />
    </div>
  );
};

export { InitializeProgram };
