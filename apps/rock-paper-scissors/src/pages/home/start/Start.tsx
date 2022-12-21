import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { ReactComponent as CreateSVG } from 'assets/images/icons/create.svg';
import styles from './Start.module.scss';

type Props = {
  onCreateClick: (arg: string) => void;
  setProgramID: (arg: Hex) => void;
};

function Start({ onCreateClick, setProgramID }: Props) {
  return (
    <>
      <h2 className={styles.heading}>Rock Paper Scissors Lizard Spock</h2>
      <Button
        icon={CreateSVG}
        text="Create new game"
        size="large"
        className={styles.button}
        onClick={() =>{setProgramID(''as Hex); onCreateClick('create')}}
      />
      <Button
        icon={CreateSVG}
        text="Join game"
        size="large"
        className={styles.button}
        onClick={() =>{setProgramID(''as Hex); onCreateClick('join')}}
      />
    </>
  );
}

export { Start };