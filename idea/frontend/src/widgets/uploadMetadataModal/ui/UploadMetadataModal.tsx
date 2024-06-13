import { Button, Input, Modal } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { useForm } from 'react-hook-form';
import SimpleBar from 'simplebar-react';

import { useContractApiWithFile } from '@/hooks';
import { ModalProps } from '@/entities/modal';
import { UploadMetadata } from '@/features/uploadMetadata';
import plusSVG from '@/shared/assets/images/actions/plus.svg?react';

import styles from './UploadMetadataModal.module.scss';

const defaultValues = { name: '' };

type Props = ModalProps & {
  onSubmit: (values: { metaHex: HexString; name: string }) => void;
  isCode?: boolean;
};

// TODO sails: currently, UploadMetadata serves as a monkey patch from the original implementation.
// useContractApiWithFile is based on meta-storage requests, we don't need them here
const UploadMetadataModal = ({ onClose, onSubmit, isCode }: Props) => {
  const { metadata, sails, ...contractApi } = useContractApiWithFile(undefined);

  const form = useForm({ defaultValues });
  const { register, getFieldState, formState } = form;
  const { error } = getFieldState('name', formState);
  const handleSubmit = ({ name }: typeof defaultValues) => onSubmit({ metaHex: metadata.hex!, name });

  const nameInputLabel = isCode ? 'Code Name' : 'Program Name';

  return (
    <Modal heading="Upload metadata/sails" size="large" className={styles.modal} close={onClose}>
      <SimpleBar className={styles.simplebar}>
        <form className={styles.form} onSubmit={form.handleSubmit(handleSubmit)}>
          <UploadMetadata
            value={contractApi.file}
            onChange={contractApi.handleChange}
            metadata={metadata.value}
            idl={sails.idl}
          />

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
