import { Button, FileInput } from '@gear-js/ui';
import { FormProvider, useForm } from 'react-hook-form';

import { useWasmFile } from '@/features/code';
import { UploadMetadata } from '@/features/uploadMetadata';
import { CodeVoucherSelect } from '@/features/voucher';
import { useChain, useCodeUpload, useContractApiWithFile } from '@/hooks';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import { FileTypes } from '@/shared/config';
import { Input } from '@/shared/ui';
import { BackButton } from '@/shared/ui/backButton';
import { Box } from '@/shared/ui/box';
import { Subheader } from '@/shared/ui/subheader';

import styles from './UploadCode.module.scss';

const defaultValues = {
  name: '',
  voucherId: '',
};

const UploadCode = () => {
  const { isDevChain } = useChain();
  const form = useForm({ defaultValues });

  const file = useWasmFile('code');
  const { metadata, sails, isLoading, ...contractApi } = useContractApiWithFile(file.buffer);
  const uploadCode = useCodeUpload();

  const resetForm = () => {
    form.reset();
    file.reset();
    metadata.reset();
  };

  const handleWasmFileChange = (value: File | undefined) => {
    form.reset();
    contractApi.reset();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO(#1800): resolve eslint comments
    file.handleChange(value);
  };

  const handleSubmit = form.handleSubmit((data: typeof defaultValues) => {
    if (!file.buffer) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO(#1800): resolve eslint comments
    uploadCode({ optBuffer: file.buffer, metadata, sails, resolve: resetForm, ...data });
  });

  return (
    <>
      <div className={styles.wrapper}>
        <div>
          <Subheader title="Enter code parameters" size="big" />
          <Box>
            <FormProvider {...form}>
              <form className={styles.form} id="uploadCodeForm" onSubmit={handleSubmit}>
                <FileInput
                  label="Code file"
                  direction="y"
                  value={file.value}
                  accept={FileTypes.Wasm}
                  onChange={handleWasmFileChange}
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
          <Subheader size="big" title="Add metadata/sails" />

          <UploadMetadata
            value={contractApi.file}
            onChange={contractApi.handleChange}
            metadata={metadata.value}
            sails={sails.value}
            isDisabled={contractApi.isFromStorage}
            isLoading={isLoading}
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
