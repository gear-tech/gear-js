import styles from './TimerSection.module.scss';

type Props = {
  value: number;
  timeUnit: string;
};

function TimerSection({ value, timeUnit }: Props) {
  const numbers = String(value > 99 ? 99 : value);
  const lastCharIndex = numbers.length - 1;

  return (
    <div className={styles.timerSection}>
      <span className={styles.timeUnit}>{timeUnit}</span>
      <div className={styles.clockFace}>
        <p className={styles.timeValue}>{lastCharIndex && numbers[0]}</p>
        <p className={styles.timeValue}>{numbers[lastCharIndex]}</p>
      </div>
    </div>
  );
}

export { TimerSection };
