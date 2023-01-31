import { ProgramMetadata } from '@gear-js/api';
import { Checkbox } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';

import { getPreformattedText } from 'shared/helpers';
import { FormText } from 'shared/ui/form';
import { getMetadataProperties } from 'features/uploadMetadata/helpers';

import { MetadataFileInput } from '../metadataFileInput';
import { MetadataInput } from '../metadataInput';
import styles from './UploadMetadata.module.scss';

type Props = {
  metadata: ProgramMetadata | undefined;
  onReset: () => void;
  onUpload: (metaHex: HexString) => void;
};

const UploadMetadata = ({ metadata, onReset, onUpload }: Props) => {
  const [isManualInput, setIsManualInput] = useState(false);

  const toggleManualInput = () => setIsManualInput((prevValue) => !prevValue);
  const handleManualInputSubmit = (metaHex: HexString) => onUpload(metaHex);

  const renderMetadataProperties = (meta: ProgramMetadata) => {
    const metadataProperties = getMetadataProperties(meta);

    return Object.entries(metadataProperties).map(([name, value]) => (
      <FormText
        key={name}
        text={name === 'types' ? getPreformattedText(value) : JSON.stringify(value)}
        label={name}
        direction="y"
        isTextarea={name === 'types'}
      />
    ));
  };

  useEffect(() => {
    onReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManualInput]);

  return (
    <div className={styles.box}>
      <Checkbox label="Manual input" type="switch" checked={isManualInput} onChange={toggleManualInput} />

      {isManualInput ? (
        <MetadataInput onSubmit={handleManualInputSubmit} />
      ) : (
        <MetadataFileInput metadata={metadata} onReset={onReset} onUpload={onUpload} />
      )}

      {metadata && renderMetadataProperties(metadata)}
    </div>
  );
};

export { UploadMetadata };
