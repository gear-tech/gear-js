import { getProgramMetadata } from '@gear-js/api';
import { Button, Input, Modal } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { HexString } from '@polkadot/util/types';
import { useState, useMemo } from 'react';
import SimpleBar from 'simplebar-react';

import { useMetadataUpload, useModal } from 'hooks';
import { ModalProps } from 'entities/modal';
import { UploadMetadata } from 'features/uploadMetadata';
import { ReactComponent as plusSVG } from 'shared/assets/images/actions/plus.svg';

import { isExists } from 'shared/helpers';
import styles from './UploadMetadataModal.module.scss';

const initialValues = { name: '' };
const validate = { name: isExists };

type Props = ModalProps & {
  programId: HexString;
};

const UploadMetadataModal = ({ onClose, programId }: Props) => {
  const { getInputProps, onSubmit } = useForm({ initialValues, validate });
  const { closeModal } = useModal();

  const uploadMetadata = useMetadataUpload();

  const [metaHex, setMetaHex] = useState<HexString>();

  const metadata = useMemo(() => (metaHex ? getProgramMetadata(metaHex) : undefined), [metaHex]);

  const handleSubmit = onSubmit(({ name }) => {
    if (!metaHex) return;

    uploadMetadata({ name, programId, metaHex, resolve: closeModal });
  });

  return (
    <Modal heading="Upload metadata" size="large" className={styles.modal} close={onClose}>
      <SimpleBar className={styles.simplebar}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <UploadMetadata metadata={metadata} onReset={() => {}} onUpload={setMetaHex} />

          {metadata && <Input label="Program Name" direction="y" block {...getInputProps('name')} />}
          {metadata && <Button type="submit" icon={plusSVG} text="Upload Metadata" />}
        </form>
      </SimpleBar>
    </Modal>
  );
};

export { UploadMetadataModal };
