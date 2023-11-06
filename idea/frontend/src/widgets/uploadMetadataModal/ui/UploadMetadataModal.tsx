import { ProgramMetadata } from '@gear-js/api';
import { Button, Input, Modal } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import SimpleBar from 'simplebar-react';

import { ModalProps } from '@/entities/modal';
import { UploadMetadata } from '@/features/uploadMetadata';
import plusSVG from '@/shared/assets/images/actions/plus.svg?react';

import styles from './UploadMetadataModal.module.scss';

const defaultValues = { name: '' };

type Props = ModalProps & {
  onSubmit: (values: { metaHex: HexString; name: string }) => void;
  isCode?: boolean;
};

const UploadMetadataModal = ({ onClose, onSubmit, isCode }: Props) => {
  const form = useForm({ defaultValues });
  const { register, getFieldState, formState } = form;
  const { error } = getFieldState('name', formState);
  const handleSubmit = ({ name }: typeof defaultValues) => onSubmit({ metaHex, name });

  const [metaHex, setMetaHex] = useState('' as HexString);
  const metadata = useMemo(() => (metaHex ? ProgramMetadata.from(metaHex) : undefined), [metaHex]);
  const resetMetaHex = () => setMetaHex('' as HexString);

  const nameInputLabel = isCode ? 'Code Name' : 'Program Name';

  return (
    <Modal heading="Upload metadata" size="large" className={styles.modal} close={onClose}>
      <SimpleBar className={styles.simplebar}>
        <form className={styles.form} onSubmit={form.handleSubmit(handleSubmit)}>
          <UploadMetadata metadata={metadata} onReset={resetMetaHex} onUpload={setMetaHex} />

          {metadata && (
            <Input
              label={nameInputLabel}
              direction="y"
              block
              error={error?.message}
              {...register('name', { required: 'Field is required' })}
            />
          )}

          {metadata && <Button type="submit" icon={plusSVG} text="Upload Metadata" />}
        </form>
      </SimpleBar>
    </Modal>
  );
};

export { UploadMetadataModal };
