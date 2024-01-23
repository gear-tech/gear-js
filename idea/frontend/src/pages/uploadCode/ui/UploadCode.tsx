import { Button, FileInput, Input } from '@gear-js/ui';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { FileTypes } from '@/shared/config';
import { useChain, useCodeUpload, useMetaOnUpload } from '@/hooks';
import { Box } from '@/shared/ui/box';
import { Subheader } from '@/shared/ui/subheader';
import { BackButton } from '@/shared/ui/backButton';
import { UploadMetadata } from '@/features/uploadMetadata';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';

import styles from './UploadCode.module.scss';

const defaultValues = { name: '' };

const UploadCode = () => {
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

  const form = useForm({ defaultValues });
  const { register, getFieldState, reset, formState } = form;
  const { error } = getFieldState('name', formState);
  const required = metadata.hex ? 'Field is required' : false;

  const { isDevChain } = useChain();
  const uploadCode = useCodeUpload();

  const resetForm = () => {
    reset();
    resetOptFile();
  };

  const handleSubmit = ({ name }: typeof defaultValues) => {
    if (!optBuffer) return;

    uploadCode({ optBuffer, name, metaHex: metadata.hex, resolve: resetForm });
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
            <form className={styles.form} id="uploadCodeForm" onSubmit={form.handleSubmit(handleSubmit)}>
              <FileInput
                label="Code file"
                direction="y"
                value={optFile}
                accept={FileTypes.Wasm}
                onChange={setOptFile}
              />

              <Input label="Code name" direction="y" error={error?.message} {...register('name', { required })} />
            </form>
          </Box>
        </div>

        {!isDevChain && (
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
        )}
      </div>

      <div className={styles.buttons}>
        {optFile && <Button type="submit" text="Upload code" icon={PlusSVG} size="large" form="uploadCodeForm" />}
        <BackButton />
      </div>
    </>
  );
};

export { UploadCode };
