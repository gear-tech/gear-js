import { generateCodeHash, getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useState, useEffect } from 'react';
import { generatePath, useLocation } from 'react-router-dom';

import { fetchMetadata } from 'api';
import { readFileAsync } from 'shared/helpers';
import { RPCError, RPCErrorCode } from 'shared/services/rpcService';
import { CustomLink } from 'shared/ui/customLink';
import { routes } from 'shared/config';
import { useChain } from './context';

type MetadataState = {
  value: ProgramMetadata | undefined;
  hex: HexString | undefined;
  isUploaded: boolean;
};

const initMeta = {
  value: undefined,
  hex: undefined,
  isUploaded: false,
};

const getCodeExistsAlert = (codeId: HexString) => (
  <>
    <p>Code already exists</p>
    <p>
      ID: <CustomLink to={generatePath(routes.code, { codeId })} text={codeId} />
    </p>
  </>
);

const useMetaOnUpload = (isCode?: boolean) => {
  const { api } = useApi();
  const { isDevChain } = useChain();
  const alert = useAlert();

  const { state } = useLocation();
  const initOptFile = state?.file as File | undefined;

  const [optFile, setOptFile] = useState(initOptFile);
  const [optBuffer, setOptBuffer] = useState<Buffer>();

  const [metadata, setMetadata] = useState<MetadataState>(initMeta);
  const [isUploadedMetaReady, setIsUploadedMetaReady] = useState(true);

  const [isCodeExists, setIsCodeExists] = useState<Boolean>();

  const setUploadedMetadata = (hex: HexString) =>
    setMetadata({ hex, value: getProgramMetadata(hex), isUploaded: true });

  const setFileMetadata = (hex: HexString) => setMetadata({ hex, value: getProgramMetadata(hex), isUploaded: false });

  const resetOptFile = () => setOptFile(undefined);
  const resetOptBuffer = () => setOptBuffer(undefined);
  const resetMetadata = () => setMetadata(initMeta);

  useEffect(() => {
    if (!optFile) {
      resetOptBuffer();
      resetMetadata();

      return;
    }

    readFileAsync(optFile, 'buffer')
      .then((arrayBuffer) => Buffer.from(arrayBuffer))
      .then((result) => setOptBuffer(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optFile]);

  useEffect(() => {
    if (!isCode || !optBuffer) return;

    setIsCodeExists(undefined);

    const codeId = generateCodeHash(optBuffer);

    api.code.exists(codeId).then((result) => {
      setIsCodeExists(result);

      if (!result) return;

      resetOptFile();
      alert.error(getCodeExistsAlert(codeId));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optBuffer]);

  useEffect(() => {
    const isCodeCheckReady = isCodeExists !== undefined;

    if (!optBuffer || (isCode && !isCodeCheckReady) || isCodeExists || isDevChain) return;

    setIsUploadedMetaReady(false);

    const codeHash = generateCodeHash(optBuffer);

    fetchMetadata({ codeHash })
      .then(({ result }) => setUploadedMetadata(result.hex))
      .catch(({ code, message }: RPCError) => {
        if (code !== RPCErrorCode.MetadataNotFound) alert.error(message);
      })
      .finally(() => setIsUploadedMetaReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optBuffer, isCodeExists]);

  return {
    optFile,
    setOptFile,
    resetOptFile,
    optBuffer,
    metadata,
    setFileMetadata,
    resetMetadata,
    isUploadedMetaReady,
  };
};

export { useMetaOnUpload };
