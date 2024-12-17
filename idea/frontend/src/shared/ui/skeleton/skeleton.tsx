import clsx from 'clsx';
import { FunctionComponent, SVGProps } from 'react';

import styles from './skeleton.module.scss';

type Props = {
  width?: string;
  height?: string;
  borderRadius?: string;
  SVG?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  disabled?: boolean;
  className?: string;
};

const Skeleton = ({ width, height, borderRadius, SVG, disabled, className }: Props) => {
  return (
    <span
      className={clsx(styles.skeleton, !disabled && styles.loading, className)}
      style={{ width, height, borderRadius }}>
      {SVG && <SVG />}
    </span>
  );
};

export { Skeleton };
