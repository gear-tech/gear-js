import { useRef, ReactNode } from 'react';
import { Transition as AlertTransition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';

import { DURATION, DEFAULT_STYLE, TRANSITION_STYLES } from './const';

type Props = Partial<TransitionProps> & {
  children: ReactNode;
};

const Transition = ({ children, ...props }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <AlertTransition nodeRef={ref} timeout={DURATION} {...props}>
      {(state) => (
        <div
          ref={ref}
          style={{
            ...DEFAULT_STYLE,
            ...TRANSITION_STYLES[state],
          }}>
          {children}
        </div>
      )}
    </AlertTransition>
  );
};

export { Transition };
