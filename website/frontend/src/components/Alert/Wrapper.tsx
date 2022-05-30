import { HTMLAttributes, ReactNode } from 'react';

import styles from './Wrapper.module.scss';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode[];
};

const Wrapper = ({ children, ...props }: Props) =>
  children?.length > 0 && (
    <div className={styles.alertWrapper} {...props}>
      {children}
    </div>
  );

export { Wrapper };
