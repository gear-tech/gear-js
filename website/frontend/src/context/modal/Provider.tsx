import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { lock, unlock } from 'tua-body-scroll-lock';

import { MODALS } from './const';
import { Props } from '../types';
import { ModalContext } from './Context';

import 'assets/scss/modal.scss';

const { Provider } = ModalContext;

const ModalProvider = ({ children }: Props) => {
  const root = useRef<HTMLDivElement>();

  const [currentModal, setCurrentModal] = useState<JSX.Element | null>(null);

  const closeModal = useCallback(() => setCurrentModal(null), []);

  const showModal = useCallback(
    <T,>(modalId: string, props?: T) => {
      const ModalComponent = MODALS[modalId];

      if (ModalComponent) {
        setCurrentModal(<ModalComponent {...(props || {})} onClose={closeModal} />);
      }
    },
    [closeModal]
  );

  useEffect(() => {
    root.current = document.createElement('div');

    root.current.id = 'modal-root';

    document.body.appendChild(root.current);
  }, []);

  useMemo(() => {
    const target = root.current;

    if (currentModal) {
      lock(target);
    } else {
      unlock(target);
    }
  }, [currentModal]);

  const value = useMemo(
    () => ({
      showModal,
      closeModal,
    }),
    [showModal, closeModal]
  );

  return (
    <Provider value={value}>
      {children}
      {root.current && currentModal && createPortal(<div className="modalWrapper">{currentModal}</div>, root.current)}
    </Provider>
  );
};

export { ModalProvider };
