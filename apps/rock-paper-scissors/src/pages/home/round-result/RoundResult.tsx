import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Players } from 'components';
import styles from './RoundResult.module.scss';

type Props = {
  name: string;
  game: string;
  round: string;
  winners?:[string, `0x${string}`][]|[];
  loosers?: Hex[];
};

function RoundResult({ name, game, round, winners, loosers }: Props) {
  const hexId=winners?.map(el=>el[0])
  // const moves=winners?.map(el=>el[1])
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <span>{name}</span>
        <span>Game #{game}</span>
      </h2>
      <h3 className={styles.subheading}>Round {round} result</h3>
      <Players heading="Advance to the next round" list={hexId} className={styles.players} center />
      <Players heading="Losers" list={loosers} center />
      <Button text="Close" size="large" className={styles.button} />
    </div>
  );
}

export { RoundResult };
