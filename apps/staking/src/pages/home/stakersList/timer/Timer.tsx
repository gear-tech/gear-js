import styles from './Timer.module.scss';
import { TimerSection } from './timerSection';

function Timer() {
  return (
    <div className={styles.timer}>
      <TimerSection value="24" timeUnit="Days" />
      <span className={styles.separator}>:</span>
      <TimerSection value="17" timeUnit="Hours" />
      <span className={styles.separator}>:</span>
      <TimerSection value="32" timeUnit="Minutes" />
    </div>
  );
}

export { Timer };
