import { Button, FileInput, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

import { useChain, useCodeUpload, useMetaOnUpload } from 'hooks';
import { isExists } from 'shared/helpers';
import { Box } from 'shared/ui/box';
import { Subheader } from 'shared/ui/subheader';
import { BackButton } from 'shared/ui/backButton';
import { UploadMetadata } from 'features/uploadMetadata';
import { ReactComponent as PlusSVG } from 'shared/assets/images/actions/plus.svg';

import styles from './UploadCode.module.scss';

const initialValues = { name: '' };
const validate = { name: isExists };

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

  const { getInputProps, onSubmit, reset } = useForm({ initialValues, validate: metadata.hex ? validate : undefined });

  const { isDevChain } = useChain();
  const uploadCode = useCodeUpload();

  const resetForm = () => {
    reset();
    resetOptFile();
  };

  const handleSubmit = onSubmit(({ name }) => {
    if (!optBuffer) return;

    uploadCode({ optBuffer, name, metaHex: metadata.hex, resolve: resetForm });
  });

  useEffect(() => {
    if (optFile) return;

    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optFile]);

  return (
    <>
      <div className={styles.wrapper}>
        <div>
          <Subheader title="Enter code parameters" size="big" />
          <Box>
            <form className={styles.form} id="uploadCodeForm" onSubmit={handleSubmit}>
              <FileInput label="Code file" direction="y" value={optFile} onChange={setOptFile} />
              <Input label="Code name" direction="y" {...getInputProps('name')} />
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
              onReset={resetMetadata}
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
