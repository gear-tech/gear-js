import cx from 'clsx';
import { ReactNode, MouseEvent } from 'react';

import CrossSVG from '../../assets/images/cross.svg?react';
import { useRootPortal } from '../../hooks';
import { Button } from '../button';
import { ScrollArea } from '../scroll-area';

import styles from './modal.module.scss';

type Props = {
  heading: string;
  close: () => void;
  children?: ReactNode;
  className?: string;
  headerAddon?: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'small' | 'medium' | 'large' | (string & NonNullable<unknown>);
};

const Modal = ({ heading, close, children, className, headerAddon, footer, maxWidth = 'small' }: Props) => {
  const handleOverlayClick = ({ target, currentTarget }: MouseEvent) => {
    if (target === currentTarget) close();
  };

  const isCustomMaxWidth = !['small', 'medium', 'large'].includes(maxWidth);

  return useRootPortal(
    'modal-root',
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- TODO(#1810): resolve eslint comments
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={cx(styles.modal, !isCustomMaxWidth && styles[maxWidth])}
        style={isCustomMaxWidth ? { maxWidth } : undefined}>
        <header className={styles.header}>
          <div className={styles.headingContainer}>
            <h3 className={styles.heading}>{heading}</h3>
            {headerAddon}
          </div>

          <Button icon={CrossSVG} color="transparent" size="medium" onClick={close} />
        </header>

        {children && <ScrollArea className={cx(styles.body, className)}>{children}</ScrollArea>}

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
  );
};

export { Modal };
export type { Props as ModalProps };
