import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import { StateWithFile } from 'shared/types';

import { ProgramSection } from './programSection';
import { MetadataSection } from './metadataSection';
import styles from './UploadProgram.module.scss';

const UploadProgram = () => {
  const { state } = useLocation();
  const { file } = (state as StateWithFile | undefined) || {};

  const [metaHex, setMetaHex] = useState<HexString>();
  const metadata = useMemo(() => (metaHex ? getProgramMetadata(metaHex) : undefined), [metaHex]);

  const resetMetaHex = () => setMetaHex(undefined);

  return (
    <div className={styles.uploadProgramPage}>
      <ProgramSection file={file} metaHex={metaHex} metadata={metadata} resetMetaFile={resetMetaHex} />
      <MetadataSection metadata={metadata} onReset={resetMetaHex} onUpload={setMetaHex} />
    </div>
  );
};

export { UploadProgram };
