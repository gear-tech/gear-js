import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Hex, getProgramMetadata } from '@gear-js/api';

import styles from './InitializeProgram.module.scss';
import { PageParams } from '../model';
import { CodeSection } from './codeSection';
import { MetadataSection } from './metadataSection';

const InitializeProgram = () => {
  const { codeId } = useParams() as PageParams;

  const [metaHex, setMetaHex] = useState<Hex>();
  const metadata = useMemo(() => (metaHex ? getProgramMetadata(metaHex) : undefined), [metaHex]);

  const resetMetaHex = () => setMetaHex(undefined);

  return (
    <div className={styles.initializeProgramPage}>
      <CodeSection codeId={codeId} metaHex={metaHex} metadata={metadata} resetMetadada={resetMetaHex} />
      <MetadataSection metadata={metadata} onReset={resetMetaHex} onUpload={setMetaHex} />
    </div>
  );
};

export { InitializeProgram };
