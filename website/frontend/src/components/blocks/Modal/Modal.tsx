import React from 'react';

import './Modal.scss';
import { CloseIcon } from '../../../assets/Icons';
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock';

type Props = {
  open: boolean;
  content: any;
  title?: string;
  handleClose: () => void;
};

export const Modal = ({ open, content, handleClose, ...props }: Props) => {
  const targetRef = useBodyScrollLock<HTMLDivElement>(open);

  return open ? (
    <div className="modal__wrapper" ref={targetRef}>
      <div className="modal__box">
        <button className="modal__close" onClick={handleClose} type="button">
          <span className="modal__close-x">
            <CloseIcon color="#ffffff" />
          </span>
        </button>
        {props.title && <h2 className="modal__title">{props.title}</h2>}
        <div className="modal__content">
          <div className="modal__text">{content}</div>
        </div>
      </div>
    </div>
  ) : null;
};

Modal.defaultProps = {
  title: false,
};
