import { Button, FileInput, Input } from '@gear-js/ui';
import { getProgramMetadata } from '@gear-js/api';
import { useForm } from '@mantine/form';
import { HexString } from '@polkadot/util/types';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useCodeUpload } from 'hooks';
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
  const { state } = useLocation();
  const initFile = state?.file as File | undefined;

  const { getInputProps, onSubmit, reset } = useForm({ initialValues, validate });
  const [file, setFile] = useState(initFile);

  const [metaHex, setMetaHex] = useState('' as HexString);
  const metadata = useMemo(() => (metaHex ? getProgramMetadata(metaHex) : undefined), [metaHex]);

  const resetFile = () => setFile(undefined);
  const resetMetaHex = () => setMetaHex('' as HexString);

  const uploadCode = useCodeUpload();

  const resetForm = () => {
    reset();
    resetFile();
    resetMetaHex();
  };

  const handleSubmit = onSubmit(({ name }) => {
    if (!file) return;

    uploadCode({ file, name, metaHex, resolve: resetForm });
  });

  return (
    <>
      <div className={styles.wrapper}>
        <div>
          <Subheader title="Enter code parameters" size="big" />
          <Box>
            <form className={styles.form} id="uploadCodeForm" onSubmit={handleSubmit}>
              <FileInput label="Code file" direction="y" value={file} onChange={setFile} />
              {metaHex && <Input label="Code name" direction="y" {...getInputProps('name')} />}
            </form>
          </Box>
        </div>

        <div>
          <Subheader size="big" title="Add metadata" />
          <UploadMetadata metadata={metadata} onUpload={setMetaHex} onReset={resetMetaHex} />
        </div>
      </div>

      <div className={styles.buttons}>
        {file && <Button type="submit" text="Upload code" icon={PlusSVG} size="large" form="uploadCodeForm" />}
        <BackButton />
      </div>
    </>
  );
};

export { UploadCode };
