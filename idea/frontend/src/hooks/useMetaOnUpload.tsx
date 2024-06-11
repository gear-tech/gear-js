import { ProgramMetadata } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

const useMetaOnUpload = (codeId?: HexString) => {
  const { api, isApiReady } = useApi();
  const { getMetadata } = useMetadata();
  const { state } = useLocation() as Location;
  const alert = useAlert();

  const [optFile, setOptFile] = useState(state?.file);
  const [optBuffer, setOptBuffer] = useState<Buffer>();

  // TODO: combine with useMetadata hook?
  const [metadata, setMetadata] = useState<MetadataState>(initMeta);
  const [isUploadedMetaReady, setIsUploadedMetaReady] = useState(true);

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

    optFile
      .arrayBuffer()
      .then((arrayBuffer) => Buffer.from(arrayBuffer))
      .then((result) => setOptBuffer(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optFile]);

  useEffect(() => {
    if (!isApiReady || (!codeId && !optBuffer)) return;

    setIsUploadedMetaReady(false);

    // assertion cuz typescript is dumb
    const getMetahash = codeId ? api.code.metaHash(codeId) : api.code.metaHashFromWasm(optBuffer!);

    getMetahash
      .then((hash) => getMetadata(hash))
      .then(({ result }) => result.hex && setUploadedMetadata(result.hex))
      .catch((error: unknown) => {
        if (typeof error === 'string' && error === NO_METAHASH_ERROR) return;
        if (error instanceof RPCError && error.code === RPCErrorCode.MetadataNotFound) return;

        alert.error(error instanceof Error ? error.message : String(error));
      })
      .finally(() => setIsUploadedMetaReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, optBuffer]);

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
