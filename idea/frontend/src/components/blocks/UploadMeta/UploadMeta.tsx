import { ChangeEvent, useMemo, useRef, useEffect } from 'react';
import { Metadata, getWasmMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { FileInput } from '@gear-js/ui';

import styles from './UploadMeta.module.scss';
import { UploadData } from './types';
import { getMetaProperties } from './helpers';

import { readFileAsync, checkFileFormat } from 'helpers';
import { formStyles, FormText } from 'components/common/Form';

type Props = {
  meta?: Metadata;
  onReset: () => void;
  onUpload: (data: UploadData) => void;
};

const UploadMeta = (props: Props) => {
  const alert = useAlert();

  const { meta, onReset, onUpload } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const prevMeta = useRef<Metadata | undefined>(meta);

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

      const readedFile = (await readFileAsync(file)) as Buffer;
      const fileMeta: Metadata = await getWasmMetadata(readedFile);

      if (!fileMeta) {
        throw new Error('Failed to load meta');
      }

      const metaBuffer = Buffer.from(new Uint8Array(readedFile)).toString('base64');

      onUpload({ meta: fileMeta, metaBuffer });
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const metaProperties = useMemo(() => {
    // if incorrect wasm file, then types will be '0x'
    if (!meta || meta.types === '0x') {
      return null;
    }

    const propertiesFromMeta = getMetaProperties(meta);

    return Object.entries(propertiesFromMeta).map(([name, value]) => (
      <FormText key={name} text={value} label={name} isTextarea={name === 'types'} />
    ));
  }, [meta]);

  // TODO: think about this
  useEffect(() => {
    const target = inputRef.current;

    if (!meta && prevMeta.current && target) {
      const change = new Event('change', { bubbles: true });

      target.value = '';
      target.files = null;
      target.dispatchEvent(change);
    }

    prevMeta.current = meta;
  }, [meta]);

  return (
    <>
      <div className={formStyles.formItem}>
        <FileInput
          ref={inputRef}
          label="Metadata file"
          data-testid="metaFileInput"
          className={styles.fileInput}
          onChange={handleUploadMetaFile}
        />
      </div>

      {metaProperties}
    </>
  );
};

export { UploadMeta };
