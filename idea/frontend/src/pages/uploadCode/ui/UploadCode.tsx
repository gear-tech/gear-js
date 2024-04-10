import { Button, FileInput } from '@gear-js/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { FileTypes } from '@/shared/config';
import { useChain, useCodeUpload, useMetaOnUpload } from '@/hooks';
import { Box } from '@/shared/ui/box';
import { Subheader } from '@/shared/ui/subheader';
import { BackButton } from '@/shared/ui/backButton';
import { UploadMetadata } from '@/features/uploadMetadata';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import { CodeVoucherSelect } from '@/features/voucher';
import { Input } from '@/shared/ui';

import styles from './UploadCode.module.scss';

const defaultValues = {
  name: '',
  voucherId: '',
};

const UploadCode = () => {
  const { isDevChain } = useChain();

  const {
    optFile,
    setOptFile,
    resetOptFile,
    optBuffer,
    metadata,
    setFileMetadata,
    resetMetadata,
    isUploadedMetaReady,
  } = useMetaOnUpload(true);

  const methods = useForm({ defaultValues });
  const { reset, handleSubmit } = methods;

  const uploadCode = useCodeUpload();

  const resetForm = () => {
    reset();
    resetOptFile();
  };

  const onSubmit = (data: typeof defaultValues) => {
    if (!optBuffer) return;

    uploadCode({ optBuffer, metaHex: metadata.hex, resolve: resetForm, ...data });
  };

  useEffect(() => {
    if (optFile) return;

    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optFile]);

  const handleMetadataReset = () => {
    resetMetadata();
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
                  value={optFile}
                  accept={FileTypes.Wasm}
                  onChange={setOptFile}
                />

                {optFile && (
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
            isInputDisabled={!!metadata.isUploaded}
            isLoading={!isUploadedMetaReady}
            onUpload={setFileMetadata}
            onReset={handleMetadataReset}
          />
        </div>
      </div>

      <div className={styles.buttons}>
        {optFile && <Button type="submit" text="Upload code" icon={PlusSVG} size="large" form="uploadCodeForm" />}
        <BackButton />
      </div>
    </>
  );
};

export { UploadCode };
