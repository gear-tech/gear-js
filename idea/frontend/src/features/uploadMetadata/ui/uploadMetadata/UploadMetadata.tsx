import { ProgramMetadata } from '@gear-js/api';
import { FileInput, Input, Textarea } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useEffect, useMemo, useState } from 'react';
import cx from 'clsx';

import { FileTypes } from '@/shared/config';
import { getPreformattedText, isHex } from '@/shared/helpers';
import { Box } from '@/shared/ui/box';
import { formStyles } from '@/shared/ui/form';

import { getNamedTypes } from '../../helpers';
import styles from './UploadMetadata.module.scss';

type Props = {
  metadata: ProgramMetadata | undefined;
  onReset: () => void;
  onUpload: (metaHex: HexString) => void;
  isInputDisabled?: boolean;
  isLoading?: boolean;
};

const FILE_EXTENSION = {
  TXT: 'txt',
  IDL: 'idl',
};

const getFileExtension = ({ name }: File) => name.substring(name.lastIndexOf('.') + 1, name.length);

const UploadMetadata = ({ metadata, isInputDisabled, isLoading, onReset, onUpload }: Props) => {
  const alert = useAlert();

  // TODO: refactor, no need to use state there
  const [file, setFile] = useState<File>();

  const resetMetaFile = () => setFile(undefined);

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
    if (!metadata) resetMetaFile();
  }, [metadata]);

  const handleFileInputChange = async (value: File | undefined) => {
    if (!value) return onReset();

    const extension = getFileExtension(value);
    if (![FILE_EXTENSION.TXT, FILE_EXTENSION.IDL].includes(extension)) return alert.error('Invalid file extension');

    setFile(value);

    const text = await value.text();

    if (extension === FILE_EXTENSION.TXT) {
      const metadataHex = isHex(text) ? text : (`0x${text}` as const);
      return onUpload(metadataHex);
    }

    if (extension === FILE_EXTENSION.IDL) {
      console.log('idl');
    }
  };

  return (
    <Box className={cx(styles.box, isLoading && styles.loading)}>
      {!isInputDisabled && !isLoading && (
        <FileInput
          value={file}
          color="primary"
          label="Upload the meta.txt file"
          direction="y"
          className={cx(formStyles.field, formStyles.gap16)}
          onChange={handleFileInputChange}
          accept={[FileTypes.Text, FileTypes.Idl]}
        />
      )}

      {renderTypes()}

      {registryTypes && (
        <Textarea label="types" direction="y" value={getPreformattedText(registryTypes)} block readOnly />
      )}
    </Box>
  );
};

export { UploadMetadata };
