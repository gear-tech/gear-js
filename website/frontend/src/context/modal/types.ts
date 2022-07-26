import { FC } from 'react';

export type Modals = {
  [key: string]: FC<any>;
};

export type ModalProps = {
  onClose: () => void;
};

export type ModalContainerFactory = {
  showModal: <T>(modalId: string, props?: T) => void;
  closeModal: () => void;
};
