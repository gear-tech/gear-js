import clsx from 'clsx';
import styles from './Chip.module.scss';

type Props = {
  color: string;
};

function Chip({ color }: Props) {
  return <div className={clsx(styles.chip, styles[color])} />;
}

export { Chip };
