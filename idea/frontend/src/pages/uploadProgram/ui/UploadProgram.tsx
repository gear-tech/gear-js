import { Button, FileInput } from '@gear-js/ui';
import cx from 'clsx';

import { useContractApiWithFile, useProgramActions } from '@/hooks';
import { formStyles } from '@/shared/ui/form';
import { BackButton } from '@/shared/ui/backButton';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import { Subheader } from '@/shared/ui/subheader';
import { FileTypes, GasMethod } from '@/shared/config';
import { Payload } from '@/hooks/useProgramActions/types';
import { ProgramForm, RenderButtonsProps, SailsProgramForm, SubmitHelpers } from '@/widgets/programForm';
import { useWasmFile } from '@/features/code';
import { UploadMetadata } from '@/features/uploadMetadata';

import styles from './UploadProgram.module.scss';

const UploadProgram = () => {
  const wasmFile = useWasmFile();
  const { metadata, sails, isLoading, ...contractApi } = useContractApiWithFile(wasmFile.buffer);
  const { uploadProgram } = useProgramActions();

  const reset = () => {
    wasmFile.reset();
    contractApi.reset();
  };

  const handleWasmFileChange = (value: File | undefined) => {
    contractApi.reset();
    wasmFile.handleChange(value);
  };

  const renderButtons = ({ isDisabled }: RenderButtonsProps) => (
    <>
      <Button icon={PlusSVG} type="submit" text="Upload Program" size="large" disabled={isDisabled} />
      <BackButton />
    </>
  );

  const handleSubmit = (payload: Payload, { enableButtons }: SubmitHelpers) => {
    if (!wasmFile.buffer) return;

    uploadProgram({ optBuffer: wasmFile.buffer, payload, resolve: reset, reject: enableButtons });
  };

  return (
    <div className={styles.uploadProgramPage}>
      <section className={styles.pageSection}>
        <Subheader size="big" title="Enter program parameters" />

        <div className={styles.lining}>
          <FileInput
            value={wasmFile.value}
            label="Program file"
            direction="y"
            color="primary"
            className={cx(formStyles.field, formStyles.gap16, styles.fileInput)}
            onChange={handleWasmFileChange}
            accept={FileTypes.Wasm}
          />

          {wasmFile.buffer && !sails.value && (
            <ProgramForm
              fileName={wasmFile.value?.name.split(/\.opt|\.wasm/)[0]}
              source={wasmFile.buffer}
              metaHex={metadata.hex}
              metadata={metadata.value}
              gasMethod={GasMethod.InitUpdate}
              renderButtons={renderButtons}
              onSubmit={handleSubmit}
            />
          )}

          {wasmFile.buffer && sails.value && (
            <SailsProgramForm
              fileName={wasmFile.value?.name.split(/\.opt|\.wasm/)[0]}
              source={wasmFile.buffer}
              sails={sails.value}
              gasMethod={GasMethod.InitUpdate}
              renderButtons={renderButtons}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </section>

      <section className={styles.pageSection}>
        <Subheader size="big" title="Add metadata/sails" />

        <UploadMetadata
          value={contractApi.file}
          onChange={contractApi.handleChange}
          metadata={metadata.value}
          idl={sails.idl}
          isDisabled={contractApi.isFromStorage}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
};

export { UploadProgram };
