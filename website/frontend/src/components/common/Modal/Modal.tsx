import { FC, ReactNode } from 'react';

import './Modal.scss';

import { ReactComponent as CloseSVG } from 'assets/images/close.svg';

type Props = {
  content: ReactNode;
  title?: string;
  handleClose: () => void;
};

export const Modal: FC<Props> = ({ content, handleClose, title }) => (
  <div className="modal__box" data-testid="modal">
    <button className="modal__close" onClick={handleClose} type="button" aria-label="Close modal">
      <span className="modal__close-x">
        <CloseSVG color="#ffffff" />
      </span>
    </button>
    {title && <h2 className="modal__title">{title}</h2>}
    <div className="modal__content">{content}</div>
  </div>
);
