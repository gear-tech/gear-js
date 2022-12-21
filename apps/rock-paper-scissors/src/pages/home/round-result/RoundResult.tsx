import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Players } from 'components';
import styles from './RoundResult.module.scss';

type Props = {
  onClickRoute: (route:string) => void;
  name: string;
  game: string;
  round: string;
  winners?: [string, `0x${string}`][] | [];
  loosers?: Hex[];
  nextRound?: boolean;
};

function RoundResult({ name, game, round, winners, loosers, nextRound, onClickRoute }: Props) {
  const getButtonText=nextRound ? 'Next Round' : 'Close';
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        <span>{name}</span>
        <span>Game #{game}</span>
      </h2>
      <h3 className={styles.subheading}>Round {round} result</h3>
      <Players heading="Advance to the next round" list={winners as []} className={styles.players} center />
      <Players heading="Losers" list={loosers as Hex[] || []} center />
      <Button text={getButtonText} size="large" className={styles.button} onClick={()=>onClickRoute('game')} />
    </div>
  );
}

export { RoundResult };
