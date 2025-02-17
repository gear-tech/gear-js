import { cloneElement, ReactElement, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

type Props = CSSTransitionProps & {
  // intended behavior: https://github.com/facebook/react/issues/31824
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactElement<any>;
};

// TODO(#1780): temporary react 19 patch
function CSSTransitionWithRef({ children, ...restProps }: Props) {
  const ref = useRef<HTMLElement>(null);

  const setRef = (value: HTMLElement | null) => {
    ref.current = value;
  };

  return (
    <CSSTransition nodeRef={ref} {...restProps}>
      {cloneElement(children, { ref: setRef })}
    </CSSTransition>
  );
}

export { CSSTransitionWithRef };
