import { useRef, useEffect, ChangeEvent } from 'react';
import clsx from 'clsx';
import { Metadata, getWasmMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { FileInput } from '@gear-js/ui';

import { usePrevious } from 'hooks';
import { checkFileFormat, readFileAsync } from 'shared/helpers';
import { FormText, formStyles } from 'shared/ui/form';

import styles from './UploadMetadata.module.scss';
import { UploadData } from '../model';
import { getMetadataProperties } from '../helpers';

type Props = {
  metadata?: Metadata;
  onReset: () => void;
  onUpload: (data: UploadData) => void;
};

const UploadMetadata = ({ metadata, onReset, onUpload }: Props) => {
  const alert = useAlert();

  const inputRef = useRef<HTMLInputElement>(null);
  const prevMetadata = usePrevious<Metadata | undefined>(metadata);

  const handleUploadMetaFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      onReset();

      return;
    }

    try {
      if (!checkFileFormat(file)) {
        throw new Error('Wrong file format');
      }

      const readedFile = await readFileAsync(file, 'buffer');
      const fileMeta: Metadata = await getWasmMetadata(readedFile as Buffer);

      if (!fileMeta) {
        throw new Error('Failed to load meta');
      }

      const metadataBuffer = Buffer.from(new Uint8Array(readedFile)).toString('base64');

      onUpload({ metadata: fileMeta, metadataBuffer });
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const renderMetadataProperties = (meta: Metadata) => {
    // if incorrect wasm file, then types will be '0x'
    if (meta.types === '0x') {
      return null;
    }

    const metadataProperties = getMetadataProperties(meta);

    return Object.entries(metadataProperties).map(([name, value]) => (
      <FormText key={name} text={value} label={name} direction="y" isTextarea={name === 'types'} />
    ));
  };

  // TODO: think about this
  useEffect(() => {
    const target = inputRef.current;

    if (!metadata && prevMetadata && target) {
      const change = new Event('change', { bubbles: true });

      target.value = '';
      target.files = null;
      target.dispatchEvent(change);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  return (
    <div className={styles.uploadMetadata}>
      <FileInput
        ref={inputRef}
        color="primary"
        label="Metadata file"
        direction="y"
        className={clsx(formStyles.field, formStyles.gap16)}
        onChange={handleUploadMetaFile}
      />
      {metadata ? renderMetadataProperties(metadata) : null}
    </div>
  );
};

export { UploadMetadata };
