import { Button, Input } from '@gear-js/ui';
import { BackButton } from 'components';
import styles from './Create.module.scss';

function Create() {
  return (
    <>
      <h2 className={styles.heading}>Create new game</h2>
      <form className={styles.form}>
        <Input label="Bet size" direction="y" />
        <Input label="Max players" direction="y" />
        <Input label="Entry timeout" direction="y" />
        <Input label="Move timeout" direction="y" />
        <Input label="Reveal timeout" direction="y" />
        <div className={styles.buttons}>
          <BackButton />
          <Button text="Create" size="large" />
        </div>
      </form>
    </>
  );
}

export { Create };
