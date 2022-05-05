import { Button, Modal } from '@gear-js/ui';
import styles from './ConfirmationModal.module.scss';

type Props = {
  heading: string;
  close: () => void;
  onSubmit: () => void;
};

function ConfirmationModal({ heading, close, onSubmit }: Props) {
  return (
    <Modal heading={heading} className={styles.modal} close={close}>
      <Button text="No" color="secondary" onClick={close} />
      <Button text="Yes" onClick={onSubmit} />
    </Modal>
  );
}

export default ConfirmationModal;
