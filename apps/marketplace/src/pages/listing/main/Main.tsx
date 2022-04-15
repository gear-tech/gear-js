import { Button } from '@gear-js/ui';
import kitty200 from 'assets/images/placeholders/kitty200.svg';
import styles from './Main.module.scss';

function Main() {
  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <img src={kitty200} alt="Kitty #200" className={styles.image} />
      </div>
      <div className={styles.buttons}>
        <Button text="Make offer" color="secondary" className={styles.button} />
        <Button text="Buy now" className={styles.button} />
      </div>
    </div>
  );
}

export default Main;
