import { useRef, ReactNode } from 'react';
import { Transition as AlertTransition } from 'react-transition-group';

const duration = 250;

const defaultStyle = {
  opacity: 0,
  transition: `opacity ${duration}ms ease`,
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

type Props = {
  children: ReactNode;
};

const Transition = ({ children, ...props }: Props) => {
  const ref = useRef(null);

  return (
    <AlertTransition nodeRef={ref} {...props} timeout={duration}>
      {(state) => (
        <div
          ref={ref}
          style={{
            ...defaultStyle,
            //@ts-ignore
            ...transitionStyles[state],
          }}
        >
          {children}
        </div>
      )}
    </AlertTransition>
  );
};

export { Transition };
