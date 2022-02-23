import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { Hex } from '@gear-js/api';
import copy from 'assets/images/copy.svg';
import { copyToClipboard, readFileAsync } from 'helpers';
import { useApi } from 'hooks/useApi';
import { Button } from 'common/components/Button/Button';
import { Modal } from 'components/blocks/Modal';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { DroppedFile } from '../types';
import styles from './CodeModal.module.scss';

type Props = {
  file: File;
  setDroppedFile: Dispatch<SetStateAction<DroppedFile | null>>;
};

const CodeModal = ({ file, setDroppedFile }: Props) => {
  const [api] = useApi();
  const alert = useAlert();
  const [codeHash, setCodeHash] = useState('' as Hex);

  const uploadCode = async () => {
    const arrayBuffer = (await readFileAsync(file)) as ArrayBuffer;
    const buffer = Buffer.from(arrayBuffer);
    const hash = api.code.submit(buffer);

    setCodeHash(hash);
  };

  useEffect(() => {
    uploadCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setDroppedFile(null);
  };

  const handleClick = () => {
    copyToClipboard(codeHash, alert);
    close();
  };

  return (
    <Modal
      open={true}
      handleClose={close}
      title="Code Hash:"
      content={
        codeHash ? (
          <>
            <p>{codeHash}</p>
            <Button icon={copy} onClick={handleClick} className={styles.button} />
          </>
        ) : (
          <Spinner />
        )
      }
    />
  );
};

export { CodeModal };
