import React, { FC } from 'react';

import './Modal.scss';
import { CloseIcon } from '../../../assets/Icons';
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock';

type Props = {
  open: boolean;
  content: React.ReactNode;
  title?: string;
  handleClose: () => void;
  isModal?: boolean;
};

export const Modal: FC<Props> = ({ open, content, handleClose, isModal, title }) => {
  const targetRef = useBodyScrollLock<HTMLDivElement>(open);

  return open ? (
    <div
      className="modal__wrapper"
      ref={targetRef}
      onClick={() => {
        if (isModal) {
          handleClose();
        }
      }}
      aria-hidden="true"
    >
      <div className="modal__box">
        <button className="modal__close" onClick={handleClose} type="button">
          <span className="modal__close-x">
            <CloseIcon color="#ffffff" />
          </span>
        </button>
        {title && <h2 className="modal__title">{title}</h2>}
        <div className="modal__content">
          <div className="modal__text">{content}</div>
        </div>
      </div>
    </div>
  ) : null;
};

Modal.defaultProps = {
  title: undefined,
  isModal: true,
};
