import { useState } from 'react';
import { Button, FileInput, Input } from '@gear-js/ui';

import { Box } from 'shared/ui/box';
import { Subheader } from 'shared/ui/subheader';
import { BackButton } from 'shared/ui/backButton';
import { ReactComponent as PlusSVG } from 'shared/assets/images/actions/plus.svg';

import { useLocation } from 'react-router-dom';
import styles from './UploadCode.module.scss';

const UploadCode = () => {
  const { state } = useLocation();
  const initFile = state?.file as File | undefined;

  const [file, setFile] = useState(initFile);

  return (
    <>
      <Subheader title="Upload Code" size="big" />

      <Box className={styles.box}>
        <form className={styles.form}>
          <FileInput label="Code file" gap="1/5" value={file} onChange={setFile} />
          <Input label="Code name" gap="1/5" />
        </form>
      </Box>

      <div className={styles.buttons}>
        {file && <Button text="Upload code" icon={PlusSVG} size="large" />}
        <BackButton />
      </div>
    </>
  );
};

export { UploadCode };
