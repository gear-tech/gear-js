import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProgramMetadata } from '@gear-js/api';

import { StateWithFile } from 'shared/types';

import { ProgramSection } from './programSection';
import { MetadataSection } from './metadataSection';
import styles from './UploadProgram.module.scss';

const UploadProgram = () => {
  const { state } = useLocation();
  const { file } = (state as StateWithFile | undefined) || {};

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  const resetMetadada = () => setMetadata(undefined);

  return (
    <div className={styles.uploadProgramPage}>
      <ProgramSection file={file} metadata={metadata} resetMetaFile={resetMetadada} />
      <MetadataSection metadata={metadata} onReset={resetMetadada} onUpload={setMetadata} />
    </div>
  );
};

export { UploadProgram };
