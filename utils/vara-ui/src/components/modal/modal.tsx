import { ReactNode, useEffect, useState, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import cx from 'clsx';
import { ReactComponent as CrossSVG } from '../../assets/images/cross.svg';
import { Button } from '../button';
import styles from './modal.module.css';

type Props = {
  heading: string;
  close: () => void;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
};

const Modal = ({ heading, close, children, className, bodyClassName }: Props) => {
  const [root, setRoot] = useState<HTMLDivElement>();

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
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={cx(styles.modal, className)}>
        <header className={styles.header}>
          <h3 className={styles.heading}>{heading}</h3>

          <Button icon={CrossSVG} color="transparent" onClick={close} className={styles.button} />
        </header>

        {children && <div className={cx(styles.body, bodyClassName)}>{children}</div>}
      </div>
    </div>
  );

  return root ? createPortal(component, root) : null;
};

export { Modal };
export type { Props as ModalProps };
