import { getProgramMetadata } from '@gear-js/api';
import { Button, Input, Modal } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { HexString } from '@polkadot/util/types';
import { useState, useMemo } from 'react';
import SimpleBar from 'simplebar-react';

import { ModalProps } from 'entities/modal';
import { UploadMetadata } from 'features/uploadMetadata';
import { ReactComponent as plusSVG } from 'shared/assets/images/actions/plus.svg';

import { isExists } from 'shared/helpers';
import styles from './UploadMetadataModal.module.scss';

const initialValues = { name: '' };
const validate = { name: isExists };

type Props = ModalProps & {
  onSubmit: (values: { metaHex: HexString; name: string }) => void;
  isCode?: boolean;
};

const UploadMetadataModal = ({ onClose, onSubmit, isCode }: Props) => {
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;

  const [metaHex, setMetaHex] = useState('' as HexString);

  const metadata = useMemo(() => (metaHex ? getProgramMetadata(metaHex) : undefined), [metaHex]);

  const resetMetaHex = () => setMetaHex('' as HexString);

  const handleSubmit = form.onSubmit(({ name }) => onSubmit({ metaHex, name }));

  const nameInputLabel = isCode ? 'Code Name' : 'Program Name';

  return (
    <Modal heading="Upload metadata" size="large" className={styles.modal} close={onClose}>
      <SimpleBar className={styles.simplebar}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <UploadMetadata metadata={metadata} onReset={resetMetaHex} onUpload={setMetaHex} />

          {metadata && <Input label={nameInputLabel} direction="y" block {...getInputProps('name')} />}
          {metadata && <Button type="submit" icon={plusSVG} text="Upload Metadata" />}
        </form>
      </SimpleBar>
    </Modal>
  );
};

export { UploadMetadataModal };
