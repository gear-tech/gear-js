import { useRef, useEffect, ChangeEvent } from 'react';
import clsx from 'clsx';
import { ProgramMetadata, getProgramMetadata, Hex } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { FileInput } from '@gear-js/ui';
import { isHex } from '@polkadot/util';

import { usePrevious } from 'hooks';
import { checkFileFormat } from 'shared/helpers';
import { formStyles } from 'shared/ui/form';
import { FileTypes } from 'shared/config';

type Props = {
  metadata?: ProgramMetadata;
  onReset: () => void;
  onUpload: (meta: ProgramMetadata) => void;
};

const MetadataFileInput = ({ metadata, onReset, onUpload }: Props) => {
  const alert = useAlert();

  const inputRef = useRef<HTMLInputElement>(null);
  const prevMetadata = usePrevious<ProgramMetadata | undefined>(metadata);

  const handleUploadMetaFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      onReset();

      return;
    }

    try {
      if (!checkFileFormat(file, FileTypes.Text)) throw new Error('Wrong file format');

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = ({ target }) => {
        if (target) {
          const { result } = target;

          if (isHex(result)) {
            const meta = getProgramMetadata(result);

            onUpload(meta);
          } else if (typeof result === 'string') {
            const hexResult = `0x${result}` as Hex;
            const meta = getProgramMetadata(hexResult);

            onUpload(meta);
          } else throw new Error('Error reading meta file');
        }
      };
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  // TODO: think about this
  useEffect(() => {
    const target = inputRef.current;

    if (!metadata && prevMetadata && target) {
      const change = new Event('change', { bubbles: true });

      target.value = '';
      target.files = null;
      target.dispatchEvent(change);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  return (
    <FileInput
      ref={inputRef}
      color="primary"
      label="Metadata file"
      direction="y"
      className={clsx(formStyles.field, formStyles.gap16)}
      onChange={handleUploadMetaFile}
    />
  );
};

export { MetadataFileInput };
