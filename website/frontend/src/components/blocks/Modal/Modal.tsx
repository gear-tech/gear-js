import React, { FC, MouseEvent, ReactNode } from 'react';
import { CloseIcon } from '../../../assets/Icons';
import { useBodyScrollLock } from 'hooks';
import './Modal.scss';

type Props = {
  open: boolean;
  content: ReactNode;
  title?: string;
  handleClose: () => void;
};

export const Modal: FC<Props> = ({ open, content, handleClose, title }) => {
  const targetRef = useBodyScrollLock<HTMLDivElement>(open);

  const handleOverlayClick = ({ target, currentTarget }: MouseEvent) => {
    if (target === currentTarget) {
      handleClose();
    }
  };

  return open ? (
    <div className="modal__wrapper" ref={targetRef} onClick={handleOverlayClick}>
      <div className="modal__box" data-testid="modal">
        <button className="modal__close" onClick={handleClose} type="button" aria-label="Close modal">
          <span className="modal__close-x">
            <CloseIcon color="#ffffff" />
          </span>
        </button>
        {title && <h2 className="modal__title">{title}</h2>}
        <div className="modal__content">{content}</div>
      </div>
    </div>
  ) : null;
};
