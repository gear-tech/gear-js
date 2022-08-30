import { Modal, Button } from '@gear-js/ui/dist/esm';

import { ModalProps } from 'entities/modal';

import styles from './UploadFileModal.module.scss';

type Props = ModalProps & {
  name: string;
};

const UploadFileModal = (props: Props) => {
  const { name, onClose } = props;

  const heading = `Upload new ${name}`;

  return <Modal heading={heading} className={styles.modalContent} close={onClose} />;
};

export { UploadFileModal };
