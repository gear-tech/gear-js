import { cloneElement, isValidElement, PropsWithChildren, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

function CSSTransitionWithRef({ children, ...restProps }: PropsWithChildren<CSSTransitionProps>) {
  const nodeRef = useRef<HTMLElement>(null);

  const setRef = (value: HTMLElement | null) => {
    nodeRef.current = value;
  };

  return (
    <CSSTransition nodeRef={nodeRef} {...restProps}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      {isValidElement(children) ? cloneElement(children, { ref: setRef }) : children}
    </CSSTransition>
  );
}

export { CSSTransitionWithRef };
