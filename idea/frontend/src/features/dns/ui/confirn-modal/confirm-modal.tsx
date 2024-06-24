import { Button, Modal } from '@gear-js/ui';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';

import styles from './confirm-modal.module.scss';

type Props = {
  title: string;
  text: string;
  confirmText: string;
  close: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
};

const ConfirmModal = ({ title, text, close, onSubmit = () => {}, confirmText, isLoading }: Props) => {
  return (
    <Modal heading={title} size="large" close={close}>
      <div className={styles.text}>{text}</div>

      <div className={styles.buttons}>
        <Button
          icon={ApplySVG}
          color="primary"
          size="large"
          text={confirmText}
          onClick={onSubmit}
          disabled={isLoading}
        />
        <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
      </div>
    </Modal>
  );
};

export { ConfirmModal };
