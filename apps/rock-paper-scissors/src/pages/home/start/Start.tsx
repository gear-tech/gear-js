import { Button } from '@gear-js/ui';
import { ReactComponent as CreateSVG } from 'assets/images/icons/create.svg';
import { Games } from './games';
import styles from './Start.module.scss';

type Props = {
  games: any[];
  ownerGames: any[];
  onCreateClick: (arg: string) => void;
};

function Start({ games, ownerGames, onCreateClick }: Props) {
  return (
    <>
      <h2 className={styles.heading}>Rock Paper Scissors Lizard Spock</h2>
      <Button
        icon={CreateSVG}
        text="Create new game"
        size="large"
        className={styles.button}
        onClick={() => onCreateClick('create')}
      />
      <Games heading="Games" list={games} />
      <Games heading="My games" list={ownerGames} />
    </>
  );
}

export { Start };
