import { Hex } from '@gear-js/api';
import { Players } from 'components';
import styles from './RoundResult.module.scss';

type Props = {
  name: string;
  game: string;
  round: string;
};

const players = ['0x00', '0x00', '0x00', '0x00'];

function RoundResult({ name, game, round }: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <span>{name}</span>
        <span>Game #{game}</span>
      </h2>
      <h3 className={styles.subheading}>Round {round} result</h3>
      <Players heading="Advance to the next round" list={players as Hex[]} className={styles.players} center />
      <Players heading="Losers" list={players as Hex[]} center />
    </div>
  );
}

export { RoundResult };
