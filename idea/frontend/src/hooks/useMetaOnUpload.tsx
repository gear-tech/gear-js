import { generateCodeHash, ProgramMetadata } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useState, useEffect } from 'react';
import { generatePath, useLocation } from 'react-router-dom';

import { readFileAsync } from '@/shared/helpers';
import { CustomLink } from '@/shared/ui/customLink';
import { routes } from '@/shared/config';
import { RPCError, RPCErrorCode } from '@/shared/services/rpcService';
import { useMetadata } from '@/features/metadata';

type MetadataState = {
  value: ProgramMetadata | undefined;
  hex: HexString | undefined;
  isUploaded: boolean;
};

type Location = {
  state: { file: File | undefined } | null;
};

const initMeta = {
  value: undefined,
  hex: undefined,
  isUploaded: false,
};

const NO_METAHASH_ERROR = 'metahash function not found in exports';

const getCodeExistsAlert = (codeId: HexString) => (
  <>
    <p>Code already exists</p>
    <p>
      ID: <CustomLink to={generatePath(routes.code, { codeId })} text={codeId} />
    </p>
  </>
);

const useMetaOnUpload = (isCode?: boolean) => {
  const { api, isApiReady } = useApi();
  const { getMetadata } = useMetadata();
  const alert = useAlert();

  const { state } = useLocation() as Location;
  const initOptFile = state?.file;

  const [optFile, setOptFile] = useState(initOptFile);
  const [optBuffer, setOptBuffer] = useState<Buffer>();

  // TODO: combine with useMetadata hook?
  const [metadata, setMetadata] = useState<MetadataState>(initMeta);
  const [isUploadedMetaReady, setIsUploadedMetaReady] = useState(true);

  const [isCodeExists, setIsCodeExists] = useState<boolean>();

  const setUploadedMetadata = (hex: HexString) =>
    setMetadata({ hex, value: ProgramMetadata.from(hex), isUploaded: true });

  const setFileMetadata = (hex: HexString) => setMetadata({ hex, value: ProgramMetadata.from(hex), isUploaded: false });

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
    if (!isApiReady || !isCode || !optBuffer) return;

    setIsCodeExists(undefined);

    const codeId = generateCodeHash(optBuffer);

    api.code.exists(codeId).then((result) => {
      setIsCodeExists(result);

      if (!result) return;

      resetOptFile();
      alert.error(getCodeExistsAlert(codeId));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, optBuffer]);

  useEffect(() => {
    const isCodeCheckReady = isCodeExists !== undefined;
    if (!isApiReady || !optBuffer || (isCode && !isCodeCheckReady) || isCodeExists) return;

    setIsUploadedMetaReady(false);

    api.code
      .metaHashFromWasm(optBuffer)
      .then((hash) => getMetadata(hash))
      .then(({ result }) => result.hex && setUploadedMetadata(result.hex))
      .catch((error: unknown) => {
        if (typeof error === 'string' && error === NO_METAHASH_ERROR) return;
        if (error instanceof RPCError && error.code === RPCErrorCode.MetadataNotFound) return;

        alert.error(error instanceof Error ? error.message : String(error));
      })
      .finally(() => setIsUploadedMetaReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, optBuffer, isCodeExists]);

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
