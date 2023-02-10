import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ProgramMetadata } from '@gear-js/api';
import { Button, FileInput } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

import { useProgramActions } from 'hooks';
import { Payload } from 'hooks/useProgramActions/types';
import { ProgramForm, SubmitHelpers, RenderButtonsProps } from 'widgets/programForm';
import { GasMethod } from 'shared/config';
import { readFileAsync, checkFileFormat } from 'shared/helpers';
import { Subheader } from 'shared/ui/subheader';
import { formStyles } from 'shared/ui/form';
import { BackButton } from 'shared/ui/backButton';
import { ReactComponent as plusSVG } from 'shared/assets/images/actions/plus.svg';

import styles from '../UploadProgram.module.scss';

type Props = {
  resetMetaFile: () => void;
  file?: File;
  metaHex: HexString | undefined;
  metadata: ProgramMetadata | undefined;
};

const ProgramSection = ({ file, metaHex, metadata, resetMetaFile }: Props) => {
  const alert = useAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileBuffer, setFileBuffer] = useState<Buffer>();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(file);

  const { uploadProgram } = useProgramActions();

  const getFileBuffer = async (currentFile: File) => {
    try {
      const buffer = await readFileAsync(currentFile, 'buffer');

      setFileBuffer(Buffer.from(new Uint8Array(buffer)));
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const setFileInputValue = (newFile: File | undefined) => {
    const target = fileInputRef.current;

    if (!target) return;

    if (newFile) {
      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(newFile);
      target.files = dataTransfer.files;
    } else {
      target.files = null;
      target.value = '';
    }

    target.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const handleChangeFile = (currentFile: File | undefined) => {
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

  const handleSubmitForm = (payload: Payload, helpers: SubmitHelpers) => {
    uploadProgram({
      file: selectedFile!,
      payload,
      resolve: () => {
        setFileBuffer(undefined);
        setFileInputValue(undefined);
        setSelectedFile(undefined);
      },
      reject: helpers.enableButtons,
    });
  };

  const renderButtons = ({ isDisabled }: RenderButtonsProps) => (
    <>
      <Button icon={plusSVG} type="submit" text="Upload Program" size="large" disabled={isDisabled} />
      <BackButton />
    </>
  );

  useEffect(() => {
    if (selectedFile) {
      getFileBuffer(selectedFile);
      setFileInputValue(selectedFile);
    } else {
      resetMetaFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  const fileInputClasses = clsx(formStyles.field, formStyles.gap16, styles.fileInput);

  return (
    <section className={styles.pageSection}>
      <Subheader size="big" title="Enter program parameters" />
      <div className={styles.lining}>
        <FileInput
          value={selectedFile}
          ref={fileInputRef}
          label="Program file"
          direction="y"
          color="primary"
          className={fileInputClasses}
          onChange={handleChangeFile}
        />
        {selectedFile && fileBuffer && (
          <ProgramForm
            source={fileBuffer}
            metaHex={metaHex}
            metadata={metadata}
            gasMethod={GasMethod.InitUpdate}
            renderButtons={renderButtons}
            onSubmit={handleSubmitForm}
          />
        )}
      </div>
    </section>
  );
};

export { ProgramSection };
