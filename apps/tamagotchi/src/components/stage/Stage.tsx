import clsx from 'clsx';
import { StageType } from 'types';
import styles from './Stage.module.scss';

type Props = {
  value: StageType;
};

function Stage({ value }: Props) {
  const className = clsx(styles.stage, styles[value]);

  return <span className={className}>{value}</span>;
}

export { Stage };
