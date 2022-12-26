import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Players } from 'components';
import styles from './GameResult.module.scss';

type Props = {
  name: string;
  game: string;
  winner: Hex;
  loosers: Hex[];
  account: Hex;
  onClickClose?:()=>void;
};

function GameResult({ onClickClose, name, game, winner, loosers, account }: Props) {
  const congratWinner = account === winner ? 'Congratulations You Win' : 'Winner';
  return (
    <div className={styles.container}>
      <h2>
        <span className={styles.heading}>{name}</span>
        <span className={styles.subheading}>Game #{game} result</span>
      </h2>
      <div className={styles.winner}>
        <p className={styles.text}>{congratWinner}</p>
        <p className={styles.address}>{winner}</p>
      </div>
      <Players heading="Loosers" list={loosers as Hex[]} center />
      <Button text="Close" size="large" className={styles.button} onClick={onClickClose}/>
    </div>
  );
}

export { GameResult };
