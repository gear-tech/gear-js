import { Button, Modal } from '@gear-js/ui';
import { FC, SVGProps } from 'react';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';

import styles from './confirm-modal.module.scss';

type Props = {
  title: string;
  text: string;
  confirmText?: string;
  confirmIcon?: FC<SVGProps<SVGSVGElement>>;
  isLoading?: boolean;
  close: () => void;
  onSubmit: () => void;
};

const ConfirmModal = ({
  title,
  text,
  confirmText = 'Submit',
  confirmIcon = ApplySVG,
  isLoading,
  close,
  onSubmit,
}: Props) => {
  return (
    <Modal heading={title} close={close}>
      <p className={styles.text}>{text}</p>

      <div className={styles.buttons}>
        <Button icon={confirmIcon} color="primary" text={confirmText} onClick={onSubmit} disabled={isLoading} />
        <Button icon={CloseSVG} color="light" text="Cancel" onClick={close} />
      </div>
    </Modal>
  );
};

export { ConfirmModal };
