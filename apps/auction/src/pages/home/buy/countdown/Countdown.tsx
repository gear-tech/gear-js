import styles from './Countdown.module.scss';

type Props = {
  hours: string;
  minutes: string;
  seconds: string;
};

function Countdown({ hours, minutes, seconds }: Props) {
  const getDigits = (value: string) =>
    value.split('').map((digit, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className={styles.digit}>
        <span>{digit}</span>
      </div>
    ));

  return (
    <div className={styles.countdown}>
      <div>
        <span className={styles.label}>Hours</span>
        <div>{getDigits(hours)}</div>
      </div>
      <span className={styles.separator}>:</span>
      <div>
        <span className={styles.label}>Minutes</span>
        <div>{getDigits(minutes)}</div>
      </div>
      <span className={styles.separator}>:</span>
      <div>
        <span className={styles.label}>Seconds</span>
        <div>{getDigits(seconds)}</div>
      </div>
    </div>
  );
}

export { Countdown };
