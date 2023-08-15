import { ProgramMetadata } from '@gear-js/api';
import { Checkbox, FileInput, Input, Textarea } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { isHex } from '@polkadot/util';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { FileTypes } from 'shared/config';
import { getPreformattedText } from 'shared/helpers';
import { Box } from 'shared/ui/box';
import { formStyles } from 'shared/ui/form';

import { getNamedTypes } from '../../helpers';
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

  // useMemo to prevent excessive error alerts
  const namedTypeEntries = useMemo(() => {
    if (!metadata) return [];

    const types = getNamedTypes(metadata, (message) => alert.error(message));

    return Object.entries(types);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const registryTypes = useMemo(() => metadata?.getAllTypes(), [metadata]);

  const renderTypes = () =>
    namedTypeEntries.map(([key, value]) => (
      <Input key={key} label={key} direction="y" value={JSON.stringify(value)} block readOnly />
    ));

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

      {renderTypes()}

      {registryTypes && (
        <Textarea label="types" direction="y" value={getPreformattedText(registryTypes)} block readOnly />
      )}
    </Box>
  );
};

export { UploadMetadata };
