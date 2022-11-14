import { Buttons } from '../buttons';
import styles from './Start.module.scss';

function Start() {
  return (
    <>
      <h1 className={styles.heading}>Syndote Game</h1>
      <p className={styles.subheading}>Press play to start</p>
      <Buttons
        onFirstClick={() => {}}
        onPrevClick={() => {}}
        onMainClick={() => {}}
        onNextClick={() => {}}
        onLastClick={() => {}}
      />
    </>
  );
}

export { Start };
