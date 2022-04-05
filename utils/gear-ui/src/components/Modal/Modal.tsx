import { ReactNode, useEffect, useState, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@gear-js/ui';
import icon from './images/x.svg';
import styles from './Modal.module.scss';

type Props = {
  caption: string;
  close: () => void;
  children?: ReactNode;
  className?: string;
};

function Modal({ caption, close, children, className }: Props) {
  const [root, setRoot] = useState<HTMLDivElement>();

  const handleOverlayClick = ({ target, currentTarget }: MouseEvent) => {
    if (target === currentTarget) close();
  };

  const mountRoot = () => {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
    setRoot(modalRoot);
  };

  const unmountRoot = () => {
    if (root) document.body.removeChild(root);
  };

  useEffect(() => {
    mountRoot();
    return () => unmountRoot();
  }, []);

  const component = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <Button className={styles.button} icon={icon} color="transparent" onClick={close} />
        <h3 className={styles.caption}>{caption}</h3>
        {children && <div className={className}>{children}</div>}
      </div>
    </div>
  );

  return root ? createPortal(component, root) : null;
}

export { Modal };
