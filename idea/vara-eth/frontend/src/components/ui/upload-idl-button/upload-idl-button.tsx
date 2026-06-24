import { type ChangeEvent, useRef, useState } from 'react';

import { Button } from '../button';

import styles from './upload-idl-button.module.scss';

type Props = {
  onSaveIdl: (idlContent: string) => string | null;
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
      if (!content) return;

      const saveError = onSaveIdl(content);
      if (saveError) {
        setError(saveError);
        event.target.value = '';
        return;
      }

      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.control}>
        <input ref={fileInputRef} type="file" accept=".idl" onChange={handleFileChange} className={styles.input} />
        <Button size="xs" onClick={handleButtonClick}>
          Upload IDL
        </Button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export { UploadIdlButton };
