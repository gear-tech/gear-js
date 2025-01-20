import clsx from 'clsx';
import { FunctionComponent, SVGProps } from 'react';

import styles from './skeleton.module.scss';

type Props = {
  SVG: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  disabled?: boolean;
};

const Skeleton = ({ SVG, disabled }: Props) => {
  return (
    <span className={clsx(styles.skeleton, !disabled && styles.loading)}>
      <SVG />
    </span>
  );
};

export { Skeleton };
