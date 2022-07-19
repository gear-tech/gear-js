import styles from './Countdown.module.scss';

type Props = {
  days: string;
  minutes: string;
  seconds: string;
};

function Countdown({ days, minutes, seconds }: Props) {
  return (
    <div className={styles.countdown}>
      <div>
        <span className={styles.label}>Days</span>
        <div>
          <span className={styles.digit}>{days[0]}</span>
          <span className={styles.digit}>{days[1]}</span>
        </div>
      </div>
      <span className={styles.separator}>:</span>
      <div>
        <span className={styles.label}>Minutes</span>
        <div>
          <span className={styles.digit}>{minutes[0]}</span>
          <span className={styles.digit}>{minutes[1]}</span>
        </div>
      </div>
      <span className={styles.separator}>:</span>
      <div>
        <span className={styles.label}>Seconds</span>
        <div>
          <span className={styles.digit}>{seconds[0]}</span>
          <span className={styles.digit}>{seconds[1]}</span>
        </div>
      </div>
    </div>
  );
}

export { Countdown };
