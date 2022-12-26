import { Button } from '@gear-js/ui';
import { ReactComponent as CreateSVG } from 'assets/images/icons/create.svg';
import styles from './Start.module.scss';

type Props = {
  onClickJoin: () => void;
  onClickCreate: () => void;
};

function Start({ onClickJoin, onClickCreate }: Props) {
  return (
    <>
      <h2 className={styles.heading}>Rock Paper Scissors Lizard Spock</h2>
      <Button
        icon={CreateSVG}
        text="Create new game"
        size="large"
        className={styles.button}
        onClick={onClickCreate}
      />
      <Button
        icon={CreateSVG}
        text="Join game"
        size="large"
        className={styles.button}
        onClick={onClickJoin}
      />
    </>
  );
}

export { Start };
