import { ProgramMetadata } from '@gear-js/api';
import { Checkbox, Input, Textarea } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';

import { Box } from 'shared/ui/box';
import { getPreformattedText } from 'shared/helpers';
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

  const renderMetadataProperties = (meta: ProgramMetadata) => {
    const metadataProperties = getMetadataProperties(meta);

    return Object.entries(metadataProperties).map(([name, value]) => {
      const isTextarea = name === 'types';
      const text = isTextarea ? getPreformattedText(value) : JSON.stringify(value);
      const Component = isTextarea ? Textarea : Input;

      return <Component key={name} label={name} direction="y" value={text} block readOnly />;
    });
  };

  useEffect(() => {
    onReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManualInput]);

  return (
    <Box className={styles.box}>
      <Checkbox label="Manual input" type="switch" checked={isManualInput} onChange={toggleManualInput} />

      {isManualInput ? (
        <MetadataInput onSubmit={onUpload} />
      ) : (
        <MetadataFileInput metadata={metadata} onReset={onReset} onUpload={onUpload} />
      )}

      {metadata && renderMetadataProperties(metadata)}
    </Box>
  );
};

export { UploadMetadata };
