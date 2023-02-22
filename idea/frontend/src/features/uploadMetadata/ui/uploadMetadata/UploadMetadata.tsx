import { ProgramMetadata } from '@gear-js/api';
import { Checkbox, FileInput, Input, Textarea } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { isHex } from '@polkadot/util';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { FileTypes } from 'shared/config';
import { getPreformattedText } from 'shared/helpers';
import { Box } from 'shared/ui/box';
import { formStyles } from 'shared/ui/form';
import { getMetadataProperties } from 'features/uploadMetadata/helpers';

import { MetadataInput } from '../metadataInput';
import styles from './UploadMetadata.module.scss';

type Props = {
  metadata: ProgramMetadata | undefined;
  onReset: () => void;
  onUpload: (metaHex: HexString) => void;
  isInputDisabled?: boolean;
  isLoading?: boolean;
};

const UploadMetadata = ({ metadata, isInputDisabled, isLoading, onReset, onUpload }: Props) => {
  const alert = useAlert();

  const [metaFile, setMetaFile] = useState<File>();
  const [isManualInput, setIsManualInput] = useState(false);

  const className = clsx(styles.box, isLoading && styles.loading);

  const resetMetaFile = () => setMetaFile(undefined);
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
    if (!metaFile) return onReset();

    try {
      const reader = new FileReader();
      reader.readAsText(metaFile, 'UTF-8');

      reader.onload = ({ target }) => {
        if (target) {
          const { result } = target;

          if (isHex(result)) {
            onUpload(result);
          } else if (typeof result === 'string') {
            const hexResult = `0x${result}` as HexString;

            onUpload(hexResult);
          } else throw new Error('Error reading meta file');
        }
      };
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaFile]);

  useEffect(() => {
    if (!metadata) resetMetaFile();
  }, [metadata]);

  useEffect(() => {
    onReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManualInput]);

  return (
    <Box className={className}>
      {!isInputDisabled && !isLoading && (
        <>
          <Checkbox label="Manual input" type="switch" checked={isManualInput} onChange={toggleManualInput} />

          {isManualInput ? (
            <MetadataInput onSubmit={onUpload} />
          ) : (
            <FileInput
              value={metaFile}
              color="primary"
              label="Upload the meta.txt file"
              direction="y"
              className={clsx(formStyles.field, formStyles.gap16)}
              onChange={setMetaFile}
              accept={FileTypes.Text}
            />
          )}
        </>
      )}

      {metadata && renderMetadataProperties(metadata)}
    </Box>
  );
};

export { UploadMetadata };
