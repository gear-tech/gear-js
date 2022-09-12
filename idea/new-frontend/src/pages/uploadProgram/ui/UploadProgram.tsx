import { useState, useCallback } from 'react';
import { Metadata } from '@gear-js/api';

import { UploadData } from 'features/uploadMetadata';

import styles from './UploadProgram.module.scss';
import { ProgramSection } from './programSection';
import { MetadataSection } from './metadataSection';

const UploadProgram = () => {
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
    <div className={styles.uploadProgramPage}>
      <ProgramSection metadata={metadata} metadataBuffer={metadataBuffer} />
      <MetadataSection metadata={metadata} onReset={resetMetadada} onUpload={uploadMetadada} />
    </div>
  );
};

export { UploadProgram };
