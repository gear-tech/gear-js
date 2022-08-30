import { Modal, Button } from '@gear-js/ui/dist/esm';

import { ModalProps } from 'entities/modal';

import styles from './UploadMetadataModal.module.scss';

type Props = ModalProps & {
  onAbort?: () => void;
  onConfirm: () => void;
};

const UploadMetadataModal = ({ onClose, onAbort, onConfirm }: Props) => {
  const handleClose = () => {
    if (onAbort) {
      onAbort();
    }

    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal heading="Upload metadata" className={styles.modalContent} close={handleClose}>
      <h4 className={styles.contentHeading}>
        Uploading metadata into the backend is necessary for further interaction with the program
      </h4>
      <p className={styles.contentFeeInfo}>This is a free of charge operation</p>
      <p className={styles.contentFeeInfo}>Please sign the metadata uploading at the next step</p>

      <div className={styles.contentButtons}>
        <Button text="Submit" className={styles.actionButton} onClick={handleConfirm} />
        <Button text="Cancel" color="secondary" className={styles.actionButton} onClick={handleClose} />
      </div>
    </Modal>
  );
};

export { UploadMetadataModal };
