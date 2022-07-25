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
          <div className={styles.digit}>
            <span>{hours[0]}</span>
          </div>
          <div className={styles.digit}>
            <span>{hours[1]}</span>
          </div>
        </div>
      </div>
      <span className={styles.separator}>:</span>
      <div>
        <span className={styles.label}>Minutes</span>
        <div>
          <div className={styles.digit}>
            <span>{minutes[0]}</span>
          </div>
          <div className={styles.digit}>
            <span>{minutes[1]}</span>
          </div>
        </div>
      </div>
      <span className={styles.separator}>:</span>
      <div>
        <span className={styles.label}>Seconds</span>
        <div>
          <div className={styles.digit}>
            <span>{seconds[0]}</span>
          </div>
          <div className={styles.digit}>
            <span>{seconds[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Countdown };
