import styles from './TimerSection.module.scss';

type Props = {
  value: number;
  timeUnit: string;
};

function TimerSection({ value, timeUnit }: Props) {
  const numbers = String(value).split('');

  return (
    <div className={styles.timerSection}>
      <span className={styles.timeUnit}>{timeUnit}</span>
      <div className={styles.clockFace}>
        {numbers.length === 1 && <p className={styles.timeValue}>0</p>}
        {numbers.map((number, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={`${number} ${index}`} className={styles.timeValue}>
            {number}
          </p>
        ))}
      </div>
    </div>
  );
}

export { TimerSection };
