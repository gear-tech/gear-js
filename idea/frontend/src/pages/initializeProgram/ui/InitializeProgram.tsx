import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProgramMetadata } from '@gear-js/api';

import styles from './InitializeProgram.module.scss';
import { PageParams } from '../model';
import { CodeSection } from './codeSection';
import { MetadataSection } from './metadataSection';

const InitializeProgram = () => {
  const { codeId } = useParams() as PageParams;

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  const resetMetadada = () => setMetadata(undefined);

  return (
    <div className={styles.initializeProgramPage}>
      <CodeSection codeId={codeId} metadata={metadata} resetMetadada={resetMetadada} />
      <MetadataSection metadata={metadata} onReset={resetMetadada} onUpload={setMetadata} />
    </div>
  );
};

export { InitializeProgram };
