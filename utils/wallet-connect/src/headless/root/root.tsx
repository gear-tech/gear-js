import { mergeProps, useRender } from '@base-ui-components/react';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { WalletProvider } from './context';

type RootProps = PropsWithChildren & useRender.ComponentProps<'div'>;

type RootElementProps = useRender.ElementProps<'div'>;

function Root({ render, ...props }: RootProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const contextValue = useMemo(() => ({ isModalOpen, openModal, closeModal }), [closeModal, isModalOpen, openModal]);

  const defaultProps: RootElementProps = {
    children: props.children,
  };

  const element = useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(defaultProps, props),
  });

  return <WalletProvider value={contextValue}>{element}</WalletProvider>;
}

export { Root };
