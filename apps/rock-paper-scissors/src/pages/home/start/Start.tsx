import { Button } from '@gear-js/ui';
import create from 'assets/images/icons/create.svg';
import styles from './Start.module.scss';

function Start() {
  return (
    <>
      <h2 className={styles.heading}>Rock Paper Scissors Lizard Spock</h2>
      <div className={styles.buttons}>
        <Button icon={create} text="Create new game" size="large" />
        <Button text="Games" color="lightGreen" size="large" />
        <Button text="My games" color="lightGreen" size="large" />
      </div>
    </>
  );
}

export { Start };
