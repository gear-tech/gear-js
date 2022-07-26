import { FC, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { ModalProps } from './types';
import { Props } from '../types';
import { ModalContext } from './Context';

const { Provider } = ModalContext;

const ModalProvider = ({ children }: Props) => {
  const root = useRef<HTMLDivElement>();

  const [currentModal, setCurrentModal] = useState<JSX.Element | null>(null);

  const closeModal = useCallback(() => setCurrentModal(null), []);

  const showModal = useCallback(
    <Props extends ModalProps>(Modal: FC<Props>, props?: Omit<Props, 'onClose'>) => {
      // @ts-ignore
      setCurrentModal(<Modal {...(props || {})} onClose={closeModal} />);
    },
    [closeModal]
  );

  useEffect(() => {
    root.current = document.createElement('div');

    document.body.appendChild(root.current);
  }, []);

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
      {root.current && createPortal(currentModal, root.current)}
    </Provider>
  );
};

export { ModalProvider };
