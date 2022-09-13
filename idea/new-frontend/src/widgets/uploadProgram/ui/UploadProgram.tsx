import { useState, useEffect, ChangeEvent } from 'react';
import clsx from 'clsx';
import { Metadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { FileInput } from '@gear-js/ui';

import { checkFileFormat, readFileAsync } from 'shared/helpers';
import { formStyles } from 'shared/ui/form';

import styles from './UploadProgram.module.scss';
import { ProgramForm } from './programForm';

type Props = {
  file?: File;
  metadata?: Metadata;
  metadataBuffer?: string;
};

const UploadProgram = ({ file, metadata, metadataBuffer }: Props) => {
  const alert = useAlert();

  const [fileBuffer, setFileBuffer] = useState<Buffer>();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(file);

  const getFileBuffer = async (currentFile: File) => {
    try {
      const buffer = await readFileAsync(currentFile, 'buffer');

      setFileBuffer(Buffer.from(new Uint8Array(buffer)));
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const currentFile = event.target.files?.[0];

    if (!currentFile) {
      setSelectedFile(undefined);

      return;
    }

    if (!checkFileFormat(currentFile)) {
      alert.error('Wrong file format');

      return;
    }

    setSelectedFile(currentFile);
  };

  useEffect(() => {
    if (selectedFile) {
      getFileBuffer(selectedFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  if (selectedFile && fileBuffer) {
    return (
      <ProgramForm
        file={selectedFile}
        fileBuffer={fileBuffer}
        metadata={metadata}
        metadataBuffer={metadataBuffer}
        onFileChange={handleChangeFile}
      />
    );
  }

  return (
    <div className={styles.lining}>
      {/* @ts-ignore */}
      <FileInput
        size="large"
        label="Program file"
        direction="y"
        className={clsx(formStyles.field, formStyles.gap16)}
        onChange={handleChangeFile}
      />
    </div>
  );
};

export { UploadProgram };
