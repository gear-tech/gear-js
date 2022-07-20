import styles from './Countdown.module.scss';

type Props = {
  hours: string;
  minutes: string;
  seconds: string;
};

function Countdown({ hours, minutes, seconds }: Props) {
  return (
    <div className={styles.countdown}>
      <div>
        <span className={styles.label}>Hours</span>
        <div>
          <span className={styles.digit}>{hours[0]}</span>
          <span className={styles.digit}>{hours[1]}</span>
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
