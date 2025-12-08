import { PropsWithChildren } from 'react';

import styles from './media-query.module.scss';

function Desktop({ children }: PropsWithChildren) {
  return <span className={styles.desktop}>{children}</span>;
}

function Mobile({ children }: PropsWithChildren) {
  return <span className={styles.mobile}>{children}</span>;
}

type BreakpointSize = 'Sm' | 'Md' | 'Lg' | 'Xl' | 'Xxl';

interface SizeProps {
  above?: React.ReactNode;
  below?: React.ReactNode;
}

const createSizeComponent = (size: BreakpointSize) =>
  function SizeComponent({ above, below }: SizeProps) {
    const aboveClassName = styles[`above${size}` as keyof typeof styles];
    const belowClassName = styles[`below${size}` as keyof typeof styles];

    return (
      <>
        {above && <span className={aboveClassName}>{above}</span>}
        {below && <span className={belowClassName}>{below}</span>}
      </>
    );
  };

const Sm = createSizeComponent('Sm');
const Md = createSizeComponent('Md');
const Lg = createSizeComponent('Lg');
const Xl = createSizeComponent('Xl');
const Xxl = createSizeComponent('Xxl');

const MediaQuery = { Desktop, Mobile, Sm, Md, Lg, Xl, Xxl };

export { MediaQuery, type BreakpointSize };
