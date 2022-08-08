import styles from './Timer.module.scss';
import { getTime } from './helpers';
import { TimerSection } from './timerSection';

type Props = {
  time: number;
};

function Timer({ time }: Props) {
  const { years, months, days, hours, minutes } = getTime(time);

  return (
    <div className={styles.timer}>
      <TimerSection value={years} timeUnit="Years" />
      <span className={styles.separator}>:</span>
      <TimerSection value={months} timeUnit="Months" />
      <span className={styles.separator}>:</span>
      <TimerSection value={days} timeUnit="Days" />
      <span className={styles.separator}>:</span>
      <TimerSection value={hours} timeUnit="Hours" />
      <span className={styles.separator}>:</span>
      <TimerSection value={minutes} timeUnit="Minutes" />
    </div>
  );
}

export { Timer };
