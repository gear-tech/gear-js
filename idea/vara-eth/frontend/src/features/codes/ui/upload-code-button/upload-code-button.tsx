import { initKzgLoading } from '@vara-eth/api/util';
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
  const close = () => setIsOpen(false);

  if (!address) return null;

  const onSelectFile = () => {
    inputRef.current?.click();
    initKzgLoading();
  };

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      uploadCode.mutate(uint8Array, { onError: close, onSuccess: close });
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <>
      <Button size="xs" onClick={() => setIsOpen(true)}>
        Upload code
      </Button>

      {isOpen && (
        <Modal
          heading="Upload Code"
          close={close}
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
