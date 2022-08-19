import clsx from 'clsx';

import styles from './IndicatorValue.module.scss';

type Props = {
  name: string;
  icon: string;
  value: number;
  className?: string;
  isHighlighted?: boolean;
};

function IndicatorValue({ name, icon, value, className, isHighlighted = false }: Props) {
  return (
    <p className={clsx(styles.indicator, className)}>
      <img src={icon} alt={name} className={styles.icon} />
      {name}
      &nbsp;&ndash;&nbsp;
      <span className={clsx(isHighlighted && styles.highlighted)}>{value} GPRT</span>
    </p>
  );
}

export { IndicatorValue };
