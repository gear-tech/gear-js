import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { Hex } from '@gear-js/api';
import { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import copy from 'assets/images/copy.svg';
import { copyToClipboard, readFileAsync } from 'helpers';
import { useApi } from 'hooks/useApi';
import { EventTypes } from 'types/alerts';
import { RootState } from 'store/reducers';
import { AddAlert } from 'store/actions/actions';
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
  const dispatch = useDispatch();
  const { account } = useSelector((state: RootState) => state.account);
  const [codeHash, setCodeHash] = useState('' as Hex);

  const close = () => {
    setDroppedFile(null);
  };

  const handleClick = () => {
    copyToClipboard(codeHash, alert);
    close();
  };

  const handleSuccess = (hash: Hex) => {
    setCodeHash(hash);
    dispatch(AddAlert({ type: EventTypes.SUCCESS, message: 'Code uploaded' }));
  };

  const handleFail = () => {
    close();
    dispatch(AddAlert({ type: EventTypes.ERROR, message: 'ExtrinsicFailed: Something when wrong' }));
  };

  const submit = async () => {
    const arrayBuffer = (await readFileAsync(file)) as ArrayBuffer;
    const buffer = Buffer.from(arrayBuffer);
    return api.code.submit(buffer);
  };

  const handleUpload = ({ events }: ISubmittableResult, hash: Hex) =>
    events.forEach(({ event: { method } }) => {
      if (method === 'CodeSaved') {
        handleSuccess(hash);
      } else if (method === 'ExtrinsicFailed') {
        handleFail();
      }
    });

  const uploadCode = async () => {
    if (account) {
      const { address, meta } = account;

      const injector = await web3FromSource(meta.source);
      const { signer } = injector;

      const hash = await submit();
      api.code.signAndSend(address, { signer }, (data) => handleUpload(data, hash));
    } else {
      // TODO: general wrapper for .wasm files upload, since this check also exists on UploadForm submit.
      // we can do this in DropTarget component, but then there'll be need to assert account variable type
      close();
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `Wallet not connected` }));
    }
  };

  useEffect(() => {
    uploadCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      open={true}
      handleClose={close}
      title="Code Uploading"
      content={
        codeHash ? (
          <>
            <p>Code hash:</p>
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
