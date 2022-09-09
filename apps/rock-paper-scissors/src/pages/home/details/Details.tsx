import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { BackButton, Detail } from 'components';
import { SVGType } from 'types';
import styles from './Details.module.scss';

type Props = {
  heading: string;
  game: string;
  round: string;
  contract: Hex;
  players: string;
  bet: string;
  entry: string;
  move: string;
  reveal: string;
  SVG: SVGType;
};

function Details({ heading, game, round, contract, players, bet, entry, move, reveal, SVG }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.visual}>
        <BackButton />
        <SVG className={styles.svg} />
      </div>
      <div>
        <h2 className={styles.heading}>{heading}</h2>
        <div className={styles.details}>
          <Detail label="Current game" text={game} className={styles.game} />
          <Detail label="Current round" text={round} className={styles.round} />
          <Detail label="Contract address" className={styles.contract}>
            <span className={styles.contractText}>{contract}</span>
          </Detail>
          <Detail label="Players" text={players} className={styles.players} />
          <Detail label="Bet size" className={styles.bet}>
            <span className={styles.betText}>{bet}</span>
          </Detail>
          <Detail label="Entry timeout" text={entry} className={styles.entry} />
          <Detail label="Move timeout" text={move} className={styles.move} />
          <Detail label="Reveal timeout" text={reveal} className={styles.reveal} />
        </div>
        <Button text="Register" block />
      </div>
    </div>
  );
}

export { Details };
