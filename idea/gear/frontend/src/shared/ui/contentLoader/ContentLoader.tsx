import { ReactNode } from 'react';
import clsx from 'clsx';

import { EmptyContent } from '@/shared/ui/emptyContent';

import styles from './ContentLoader.module.scss';

type Props = {
  text: string;
  isEmpty: boolean;
  children: ReactNode;
};

const ContentLoader = ({ isEmpty, text, children }: Props) => (
  <div className={clsx(styles.contentLoader, !isEmpty && styles.active)}>
    {children}
    <EmptyContent title={text} isVisible={isEmpty} />
  </div>
);

export { ContentLoader };
