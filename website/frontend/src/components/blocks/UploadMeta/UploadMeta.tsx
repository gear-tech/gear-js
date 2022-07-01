import { ChangeEvent, useState } from 'react';
import { Metadata, getWasmMetadata } from '@gear-js/api';
import { FileInput } from '@gear-js/ui';

import styles from './UploadMeta.module.scss';
import { UploadData } from './types';
import { getMetaProperties } from './helpers';

import { useAlert } from 'hooks';
import { readFileAsync, checkFileFormat } from 'helpers';
import { formStyles, FormText } from 'components/common/Form';

type Props = {
  onReset: () => void;
  onUpload: (data: UploadData) => void;
};

const UploadMeta = ({ onReset, onUpload }: Props) => {
  const alert = useAlert();

  const [metaProperties, setMetaProperties] = useState<[string, string][]>();
  const [droppedMetaFile, setDroppedMetaFile] = useState<File>();

  const handleResetMetaForm = () => {
    setMetaProperties(void 0);
    setDroppedMetaFile(void 0);
    onReset();
  };

  const handleUploadMetaFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return handleResetMetaForm();
    }

    try {
      if (!checkFileFormat(file)) {
        throw new Error('Wrong file format');
      }

      const readedFile = (await readFileAsync(file)) as Buffer;
      const meta: Metadata = await getWasmMetadata(readedFile);

      if (!meta) {
        throw new Error('Failed to load metadata');
      }

      const metaBufferString = Buffer.from(new Uint8Array(readedFile)).toString('base64');
      const propertiesFromFile = getMetaProperties(meta);

      setDroppedMetaFile(file);
      setMetaProperties(Object.entries(propertiesFromFile));

      onUpload({ meta, metaBufferString });
    } catch (error) {
      alert.error(String(error));
    }
  };

  return (
    <>
      <div className={formStyles.formItem}>
        <FileInput
          data-testid="metaFileInput"
          label="Metadata file"
          value={droppedMetaFile}
          className={styles.fileInput}
          onChange={handleUploadMetaFile}
        />
      </div>

      {metaProperties?.map((property) => {
        const [name, value] = property;

        return <FormText key={name} text={value} label={name} isTextarea={name === 'types'} />;
      })}
    </>
  );
};

export { UploadMeta };
