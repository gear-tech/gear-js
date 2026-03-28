import { useRef, useState } from 'react';
import { useAccount } from 'wagmi';

import { Button, Modal } from '@/components';
import { useUploadCode } from '@/features/codes/lib';

import styles from './upload-code-button.module.scss';

export const UploadCodeButton = () => {
  const uploadCode = useUploadCode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();

  if (!address) return null;

  const onSelectFile = () => {
    inputRef.current?.click();
  };

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      const arrayBuffer = reader.result;
      if (!arrayBuffer || typeof arrayBuffer === 'string') return;
      const uint8Array = new Uint8Array(arrayBuffer);

      uploadCode.mutate(uint8Array, {
        onError: () => {
          setIsOpen(false);
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Button size="xs" onClick={() => setIsOpen(true)}>
        Upload code
      </Button>

      {isOpen && (
        <Modal
          heading="Upload Code"
          close={() => setIsOpen(false)}
          action={
            <Button size="xs" onClick={onSelectFile} isLoading={uploadCode.isPending}>
              Select File
            </Button>
          }>
          {/* TODO: add drop area */}
          <input
            ref={inputRef}
            type="file"
            id="fileInput"
            onChange={handleFileUpload}
            className={styles.input}
            accept="application/wasm"
          />
        </Modal>
      )}
    </>
  );
};
