import { useContext } from 'react';
import { ModalContext } from 'app/providers/modal';

const useModal = () => useContext(ModalContext);

export { useModal };
