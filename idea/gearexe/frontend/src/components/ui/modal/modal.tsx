import clsx from 'clsx';
import { ReactNode, useEffect, useState, ReactPortal, MouseEvent } from 'react';
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
  size?: 'normal' | 'large';
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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={modalClassName}>
        <Button variant="icon" className={styles.closeButton} onClick={close}>
          <CrossIcon />
        </Button>
        <header className={styles.header}>
          <h3 className={styles.heading}>{heading}</h3>
          {action}
        </header>

        {children && <div className={bodyClassName}>{children}</div>}
      </div>
    </div>
  );

  return root ? createPortal(component, root) : null;
};

export { Modal };
export type { Props as ModalProps };
