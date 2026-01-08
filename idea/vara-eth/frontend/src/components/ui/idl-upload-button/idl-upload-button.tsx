import { HexString } from '@vara-eth/api';
import { ChangeEvent, useRef } from 'react';

import { useIdlStorage } from '@/shared/hooks/use-idl-storage';

import { Button } from '../button';

type Props = {
  id: HexString;
};

const IdlUploadButton = ({ id }: Props) => {
  const { saveIdl } = useIdlStorage(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        saveIdl(content);
      }
    };
    reader.readAsText(file);

    // Reset input value to allow uploading the same file again
    event.target.value = '';
  };

  return (
    <>
      <input ref={fileInputRef} type="file" accept=".idl" onChange={handleFileChange} style={{ display: 'none' }} />
      <Button size="xs" onClick={handleButtonClick}>
        Upload IDL
      </Button>
    </>
  );
};

export { IdlUploadButton };
