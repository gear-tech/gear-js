import { FileInput, FileInputProps } from '@gear-js/ui';

import { FileTypes } from '@/shared/config';

import styles from './program-file-input.module.scss';

type Props = Pick<FileInputProps, 'value' | 'onChange'>;

function ProgramFileInput({ value, onChange }: Props) {
  const isActive = Boolean(value);

  return (
    <FileInput
      label={isActive ? '' : 'Program file'}
      direction="y"
      color="primary"
      value={value}
      onChange={onChange}
      accept={FileTypes.Wasm}
      className={isActive ? styles.input : ''}
    />
  );
}

export { ProgramFileInput };
