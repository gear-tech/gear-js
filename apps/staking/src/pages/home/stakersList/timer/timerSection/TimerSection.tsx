import styles from './TimerSection.module.scss';

type Props = {
  value: string;
  timeUnit: string;
};

function TimerSection({ value, timeUnit }: Props) {
  return (
    <div className={styles.timerSection}>
      <span className={styles.timeUnit}>{timeUnit}</span>
      <p className={styles.timeValue}>{value[0]}</p>
      <p className={styles.timeValue}>{value[1]}</p>
    </div>
  );
}

export { TimerSection };
