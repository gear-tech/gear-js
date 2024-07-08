import { ProgramMetadata } from '@gear-js/api';
import { FileInput } from '@gear-js/ui';
import cx from 'clsx';

import { IDL } from '@/features/sails';
import { FileTypes } from '@/shared/config';
import { Box } from '@/shared/ui/box';
import { formStyles } from '@/shared/ui/form';

import styles from './UploadMetadata.module.scss';
import { MetadataPreview } from '@/features/metadata';

type Props = {
  value: File | undefined;
  onChange: (file: File | undefined) => void;
  metadata: ProgramMetadata | undefined;
  idl: string | undefined;
  isDisabled?: boolean;
  isLoading?: boolean;
};

const UploadMetadata = ({ value, metadata, idl, isDisabled, isLoading, onChange }: Props) => {
  return (
    <Box className={cx(styles.box, isLoading && styles.loading)}>
      {!isDisabled && !isLoading && (
        <FileInput
          value={value}
          color="primary"
          label="Upload the meta.txt/sails.idl file"
          direction="y"
          className={cx(formStyles.field, formStyles.gap16)}
          onChange={onChange}
          accept={[FileTypes.Text, FileTypes.Idl]}
        />
      )}

      {metadata && <MetadataPreview value={metadata} />}
      {idl && <IDL value={idl} />}
    </Box>
  );
};

export { UploadMetadata };
