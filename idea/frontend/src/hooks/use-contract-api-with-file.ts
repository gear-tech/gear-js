import { HexString, generateCodeHash } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useState } from 'react';

import { useMetadataHash, useMetadataWithFile } from '@/features/metadata';
import { useSailsWithFile } from '@/features/sails';
import { isHex } from '@/shared/helpers';

const FILE_EXTENSION = {
  TXT: 'txt',
  IDL: 'idl',
};

const getFileExtension = ({ name }: File) => name.substring(name.lastIndexOf('.') + 1, name.length);

function useContractApiWithFile(codeIdOrBuffer: HexString | Buffer | undefined) {
  const alert = useAlert();

  const [file, setFile] = useState<File>();

  const metadataHash = useMetadataHash(codeIdOrBuffer);
  const metadata = useMetadataWithFile(metadataHash);

  const codeId = Buffer.isBuffer(codeIdOrBuffer) ? generateCodeHash(codeIdOrBuffer) : undefined;
  const sails = useSailsWithFile(isHex(codeIdOrBuffer) ? codeIdOrBuffer : codeId);

  const isFromStorage = metadata.isFromStorage || sails.isFromStorage;
  const isLoading = Boolean(codeIdOrBuffer) && !isFromStorage && (sails.isLoading || !metadata.isReady);

  const reset = () => {
    setFile(undefined);
    metadata.reset();
    sails.reset();
  };

  const handleChange = async (value: File | undefined) => {
    if (!value) return reset();

    const extension = getFileExtension(value);
    if (![FILE_EXTENSION.TXT, FILE_EXTENSION.IDL].includes(extension)) return alert.error('Invalid file extension');

    const text = await value.text();

    setFile(value);

    if (extension === FILE_EXTENSION.TXT) {
      sails.reset();
      metadata.set(isHex(text) ? text : (`0x${text}` as const));

      return;
    }

    if (extension === FILE_EXTENSION.IDL) {
      metadata.reset();
      await sails.set(text);
    }
  };

  return { file, metadata, sails, isFromStorage, isLoading, reset, handleChange };
}

export { useContractApiWithFile };
