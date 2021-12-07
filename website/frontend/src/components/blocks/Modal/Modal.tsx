import React from 'react';

import './Modal.scss';
import { CloseIcon } from '../../../assets/Icons';

type Props = {
  content: any;
  title?: string;
  handleClose: () => void;
};

export const Modal = ({ content, handleClose, ...props }: Props) => (
  <div className="modal__wrapper">
    <div className="modal__box">
      <button className="modal__close" onClick={handleClose} type="button">
        <span className="modal__close-x">
          <CloseIcon color="#ffffff" />
        </span>
      </button>
      {props.title && <h2 className="modal__title">{props.title}</h2>}
      <div className="modal__text">{content}</div>
    </div>
  </div>
);

Modal.defaultProps = {
  title: false,
};
