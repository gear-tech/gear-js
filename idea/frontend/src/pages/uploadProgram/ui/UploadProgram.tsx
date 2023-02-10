import { Button, FileInput } from '@gear-js/ui';
import { clsx } from 'clsx';

import { useMetaOnUpload, useProgramActions } from 'hooks';
import { formStyles } from 'shared/ui/form';
import { BackButton } from 'shared/ui/backButton';
import { ReactComponent as PlusSVG } from 'shared/assets/images/actions/plus.svg';
import { Subheader } from 'shared/ui/subheader';
import { FileTypes, GasMethod } from 'shared/config';
import { Payload } from 'hooks/useProgramActions/types';
import { UploadMetadata } from 'features/uploadMetadata';
import { ProgramForm, RenderButtonsProps, SubmitHelpers } from 'widgets/programForm';

import styles from './UploadProgram.module.scss';

const UploadProgram = () => {
  const {
    optFile,
    setOptFile,
    resetOptFile,
    optBuffer,
    metadata,
    setFileMetadata,
    resetMetadata,
    isUploadedMetaReady,
  } = useMetaOnUpload();

  const { uploadProgram } = useProgramActions();

  const fileInputClassName = clsx(formStyles.field, formStyles.gap16, styles.fileInput);

  const renderButtons = ({ isDisabled }: RenderButtonsProps) => (
    <>
      <Button icon={PlusSVG} type="submit" text="Upload Program" size="large" disabled={isDisabled} />
      <BackButton />
    </>
  );

  const handleSubmit = (payload: Payload, { enableButtons }: SubmitHelpers) => {
    if (!optFile) return;

    uploadProgram({ file: optFile, payload, resolve: resetOptFile, reject: enableButtons });
  };

  return (
    <div className={styles.uploadProgramPage}>
      <section className={styles.pageSection}>
        <Subheader size="big" title="Enter program parameters" />

        <div className={styles.lining}>
          <FileInput
            value={optFile}
            label="Program file"
            direction="y"
            color="primary"
            className={fileInputClassName}
            onChange={setOptFile}
            accept={FileTypes.Wasm}
          />

          {optBuffer && (
            <ProgramForm
              source={optBuffer}
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
          isInputDisabled={!!metadata.isUploaded}
          isLoading={!isUploadedMetaReady}
          onReset={resetMetadata}
          onUpload={setFileMetadata}
        />
      </section>
    </div>
  );
};

export { UploadProgram };
