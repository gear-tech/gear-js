import type { ComponentProps } from 'react';

import type { ModalProps } from '@/entities/modal';

import type { MODALS } from './consts';

type ModalName = keyof typeof MODALS;

type ModalProperties<T extends ModalName> = Omit<ComponentProps<(typeof MODALS)[T]>, 'onClose'> & Partial<ModalProps>;

type ModalContainerFactory = {
  showModal: <K extends ModalName>(name: K, props?: ModalProperties<K>) => void;
  closeModal: () => void;
};

export type { ModalContainerFactory, ModalName, ModalProperties };
