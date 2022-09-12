import { useState, ReactNode, ChangeEvent } from 'react';
import { Metadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { FileInput } from '@gear-js/ui';

import { Payload } from 'hooks/useProgramActions/types';
import { checkFileFormat } from 'shared/helpers';
import { formStyles } from 'shared/ui/form';

import styles from './UploadProgram.module.scss';
import { PropsToRenderButtons, Helpers } from '../model';
import { ProgramForm } from './programForm';

type Props = {
  file?: File;
  label: string;
  metadata?: Metadata;
  metadataBuffer?: string;
  onSubmit: (payload: Payload, helpers: Helpers) => Promise<void> | void;
  renderButtons: (props: PropsToRenderButtons) => ReactNode;
};

const UploadProgram = (props: Props) => {
  const alert = useAlert();

  const { file, label, metadata, metadataBuffer, onSubmit, renderButtons } = props;

  const [selectedFile, setSelectedFile] = useState<File | undefined>(file);

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

  if (selectedFile) {
    return (
      <ProgramForm
        file={selectedFile}
        label={label}
        metadata={metadata}
        metadataBuffer={metadataBuffer}
        onSubmit={onSubmit}
        onFileChange={handleChangeFile}
        renderButtons={renderButtons}
      />
    );
  }

  return (
    <div className={styles.lining}>
      {/* @ts-ignore */}
      <FileInput size="large" label={label} direction="y" className={formStyles.field} onChange={handleChangeFile} />
    </div>
  );
};

export { UploadProgram };
