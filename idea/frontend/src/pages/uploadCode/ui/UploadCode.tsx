import { Button, FileInput } from '@gear-js/ui';
import { FormProvider, useForm } from 'react-hook-form';

import { FileTypes } from '@/shared/config';
import { useChain, useCodeUpload } from '@/hooks';
import { Box } from '@/shared/ui/box';
import { Subheader } from '@/shared/ui/subheader';
import { BackButton } from '@/shared/ui/backButton';
import { UploadMetadata } from '@/features/uploadMetadata';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import { CodeVoucherSelect } from '@/features/voucher';
import { useWasmFile } from '@/features/code';
import { Input } from '@/shared/ui';
import { useMetadataHash, useMetadataWithFile } from '@/features/metadata';

import styles from './UploadCode.module.scss';

const defaultValues = {
  name: '',
  voucherId: '',
};

const UploadCode = () => {
  const { isDevChain } = useChain();

  const file = useWasmFile('code');
  const metahash = useMetadataHash(file.buffer);
  const metadata = useMetadataWithFile(metahash);

  const methods = useForm({ defaultValues });
  const { reset, handleSubmit } = methods;

  const uploadCode = useCodeUpload();

  const resetForm = () => {
    reset();
    file.reset();
    metadata.reset();
  };

  const onSubmit = (data: typeof defaultValues) => {
    if (!file.buffer) return;

    uploadCode({ optBuffer: file.buffer, metaHex: metadata.hex, resolve: resetForm, ...data });
  };

  const handleMetadataReset = () => {
    metadata.reset();
    reset();
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div>
          <Subheader title="Enter code parameters" size="big" />
          <Box>
            <FormProvider {...methods}>
              <form className={styles.form} id="uploadCodeForm" onSubmit={handleSubmit(onSubmit)}>
                <FileInput
                  label="Code file"
                  direction="y"
                  value={file.value}
                  accept={FileTypes.Wasm}
                  onChange={(value) => (value ? file.handleChange(value) : resetForm())}
                />

                {file.value && (
                  <>
                    {/* since we're not storing codes in an indexeddb yet */}
                    {!isDevChain && <Input name="name" label="Code name" direction="y" />}
                    <CodeVoucherSelect />
                  </>
                )}
              </form>
            </FormProvider>
          </Box>
        </div>

        <div>
          <Subheader size="big" title="Add metadata" />

          <UploadMetadata
            metadata={metadata.value}
            isInputDisabled={metadata.isFromStorage}
            isLoading={file.value && !metadata.isReady}
            onMetadataUpload={metadata.set}
            onReset={handleMetadataReset}
          />
        </div>
      </div>

      <div className={styles.buttons}>
        {file.value && <Button type="submit" text="Upload code" icon={PlusSVG} size="large" form="uploadCodeForm" />}
        <BackButton />
      </div>
    </>
  );
};

export { UploadCode };
