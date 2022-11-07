import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Metadata } from '@gear-js/api';

import { UploadData } from 'features/uploadMetadata';
import { StateWithFile } from 'shared/types';

import styles from './UploadProgram.module.scss';
import { ProgramSection } from './programSection';
import { MetadataSection } from './metadataSection';

const UploadProgram = () => {
  const location = useLocation();

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

  const state = location.state as StateWithFile;

  return (
    <div className={styles.uploadProgramPage}>
      <ProgramSection
        file={state?.file}
        metadata={metadata}
        metadataBuffer={metadataBuffer}
        resetMetaFile={resetMetadada}
      />
      <MetadataSection metadata={metadata} onReset={resetMetadada} onUpload={uploadMetadada} />
    </div>
  );
};

export { UploadProgram };
