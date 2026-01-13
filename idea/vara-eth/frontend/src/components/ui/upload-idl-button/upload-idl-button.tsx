import { ChangeEvent, useRef, useState } from 'react';

import { Button } from '../button';

import styles from './upload-idl-button.module.scss';

type Props = {
  onSaveIdl: (idlContent: string) => void;
};

const UploadIdlButton = ({ onSaveIdl }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (fileExtension !== 'idl') {
      setError('Please upload a valid .idl file');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onSaveIdl(content);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className={styles.wrapper}>
      <input ref={fileInputRef} type="file" accept=".idl" onChange={handleFileChange} className={styles.input} />
      <Button size="xs" onClick={handleButtonClick}>
        Upload IDL
      </Button>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export { UploadIdlButton };
