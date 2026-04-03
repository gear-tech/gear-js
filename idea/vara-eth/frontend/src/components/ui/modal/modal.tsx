import { clsx } from 'clsx';
import { type MouseEvent, type ReactNode, type ReactPortal, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import CrossIcon from '@/assets/icons/cross.svg?react';

import { Button } from '../button';

import styles from './modal.module.scss';

type Props = {
  heading: string;
  close: () => void;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  size?: 'small' | 'normal' | 'large';
};

const Modal = ({ heading, close, children, className, size = 'normal', action }: Props): ReactPortal | null => {
  const [root, setRoot] = useState<HTMLDivElement>();

  const modalClassName = clsx(styles.modal, styles[size]);
  const bodyClassName = clsx(styles.body, className);

  const handleOverlayClick = ({ target, currentTarget }: MouseEvent) => {
    if (target === currentTarget) close();
  };

  useEffect(() => {
    const div = document.createElement('div');
    div.id = 'modal-root';
    document.body.appendChild(div);
    setRoot(div);

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  const component = (
    // biome-ignore lint/a11y: keyboard handling is provided by controls inside the modal
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={modalClassName}>
        <header className={styles.header}>
          <h3 className={styles.heading}>{heading}</h3>
          <Button variant="icon" className={styles.closeButton} onClick={close}>
            <CrossIcon />
          </Button>
        </header>

        {children && <div className={bodyClassName}>{children}</div>}

        {action && <footer className={styles.footer}>{action}</footer>}
      </div>
    </div>
  );

  return root ? createPortal(component, root) : null;
};

export type { Props as ModalProps };
export { Modal };
