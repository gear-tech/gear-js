import styles from './Indicator.module.scss';

type Props = {
  value: number;
};

const Indicator = ({ value }: Props) => <span className={styles.indicator}>{value > 99 ? '99+' : value}</span>;

export { Indicator };
