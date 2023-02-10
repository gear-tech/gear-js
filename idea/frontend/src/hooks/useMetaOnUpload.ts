import { generateCodeHash, getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { fetchCodeMetadata } from 'api';
import { readFileAsync } from 'shared/helpers';
import { RPCError, RPCErrorCode } from 'shared/services/rpcService';

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

const useMetaOnUpload = () => {
  const alert = useAlert();

  const { state } = useLocation();
  const initOptFile = state?.file as File | undefined;

  const [optFile, setOptFile] = useState(initOptFile);
  const [optBuffer, setOptBuffer] = useState<Buffer>();

  const [metadata, setMetadata] = useState<MetadataState>(initMeta);
  const [isUploadedMetaReady, setIsUploadedMetaReady] = useState(true);

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
    if (!optBuffer) return;

    setIsUploadedMetaReady(false);

    const codeId = generateCodeHash(optBuffer);

    fetchCodeMetadata(codeId)
      .then(({ result }) => setUploadedMetadata(result.hex))
      .catch(({ code, message }: RPCError) => {
        if (code !== RPCErrorCode.MetadataNotFound) alert.error(message);
      })
      .finally(() => setIsUploadedMetaReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optBuffer]);

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
