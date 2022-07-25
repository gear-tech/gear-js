import clsx from 'clsx';

import styles from './CircleIndicator.module.scss';
import { IndicatorStatus } from './types';

type Props = {
  status: IndicatorStatus;
  className: string;
};

const CircleIndicator = ({ status, className }: Props) => (
  <span className={clsx(styles.circleIndicator, styles[status], className)} />
);

export { CircleIndicator };
