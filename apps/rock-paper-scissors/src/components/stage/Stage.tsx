import clsx from 'clsx';
import { StageType } from 'types';
import styles from './Stage.module.scss';

type Props = {
  value: StageType|undefined|'';
};

function Stage({ value }: Props) {
  const className = clsx(styles.stage, styles[value||'preparation']);

  return <span className={className}>{value||'preparation'}</span>;
}

export { Stage };
