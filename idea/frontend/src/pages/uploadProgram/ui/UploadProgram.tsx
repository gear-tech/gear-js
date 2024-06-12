import { Button, FileInput } from '@gear-js/ui';
import cx from 'clsx';

import { useProgramActions } from '@/hooks';
import { formStyles } from '@/shared/ui/form';
import { BackButton } from '@/shared/ui/backButton';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import { Subheader } from '@/shared/ui/subheader';
import { FileTypes, GasMethod } from '@/shared/config';
import { Payload } from '@/hooks/useProgramActions/types';
import { UploadMetadata } from '@/features/uploadMetadata';
import { ProgramForm, RenderButtonsProps, SubmitHelpers } from '@/widgets/programForm';
import { useMetadataHash, useMetadataWithFile } from '@/features/metadata';
import { useWasmFile } from '@/features/code';

import styles from './UploadProgram.module.scss';

const UploadProgram = () => {
  const file = useWasmFile();
  const metadataHash = useMetadataHash(file.buffer);
  const metadata = useMetadataWithFile(metadataHash);

  const reset = () => {
    file.reset();
    metadata.reset();
  };

  const { uploadProgram } = useProgramActions();

  const renderButtons = ({ isDisabled }: RenderButtonsProps) => (
    <>
      <Button icon={PlusSVG} type="submit" text="Upload Program" size="large" disabled={isDisabled} />
      <BackButton />
    </>
  );

  const handleSubmit = (payload: Payload, { enableButtons }: SubmitHelpers) => {
    if (!file.buffer) return;

    uploadProgram({ optBuffer: file.buffer, payload, resolve: file.reset, reject: enableButtons });
  };

  return (
    <div className={styles.uploadProgramPage}>
      <section className={styles.pageSection}>
        <Subheader size="big" title="Enter program parameters" />

        <div className={styles.lining}>
          <FileInput
            value={file.value}
            label="Program file"
            direction="y"
            color="primary"
            className={cx(formStyles.field, formStyles.gap16, styles.fileInput)}
            onChange={(value) => (value ? file.handleChange(value) : reset())}
            accept={FileTypes.Wasm}
          />

          {file.buffer && (
            <ProgramForm
              fileName={file.value?.name.split(/\.opt|\.wasm/)[0]}
              source={file.buffer}
              metaHex={metadata.hex}
              metadata={metadata.value}
              gasMethod={GasMethod.InitUpdate}
              renderButtons={renderButtons}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </section>

      <section className={styles.pageSection}>
        <Subheader size="big" title="Add metadata" />

        <UploadMetadata
          metadata={metadata.value}
          isInputDisabled={metadata.isFromStorage}
          isLoading={file.value && !metadata.isReady}
          onReset={metadata.reset}
          onMetadataUpload={metadata.set}
        />
      </section>
    </div>
  );
};

export { UploadProgram };
