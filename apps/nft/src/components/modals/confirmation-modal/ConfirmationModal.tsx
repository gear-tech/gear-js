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
      <Button text="No" color="secondary" onClick={close} block />
      <Button text="Yes" onClick={onSubmit} block />
    </Modal>
  );
}

export { ConfirmationModal };
