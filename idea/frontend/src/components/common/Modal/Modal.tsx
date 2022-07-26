import { ReactNode, useEffect, useCallback } from 'react';
import { lock, unlock } from 'tua-body-scroll-lock';
import clsx from 'clsx';
import { Button } from '@gear-js/ui';

import styles from './Modal.module.scss';

import { useOutsideClick } from 'hooks';
import closeSVG from 'assets/images/close.svg';

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClose: () => void;
};

const Modal = ({ title, children, className, onClose }: Props) => {
  const modalRef = useOutsideClick(onClose);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const target = modalRef.current;

    lock(target);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unlock(target);
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleKeyDown]);

  return (
    <div className={styles.modalWrapper}>
      <div ref={modalRef} className={clsx(styles.modal, className)} data-testid="modal">
        <Button
          icon={closeSVG}
          aria-label="Close modal"
          color="transparent"
          className={styles.modalCloseBtn}
          onClick={onClose}
        />
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export { Modal };
