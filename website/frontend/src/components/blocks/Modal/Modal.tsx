import React from 'react';

import { CloseIcon } from 'Icons';
import './Modal.scss';

type Props = {
  content: any;
  title: string;
  handleClose: () => void;
};

const Modal = ({ content, title, handleClose }: Props) => (
  <div className="modal__wrapper">
    <div className="modal__box">
      <button className="modal__close" onClick={handleClose} type="button">
        <span className="modal__close-x">
          <CloseIcon color="#ffffff" />
        </span>
      </button>
      <h2 className="modal__title">{title}</h2>
      {content}
    </div>
  </div>
);

export default Modal;
