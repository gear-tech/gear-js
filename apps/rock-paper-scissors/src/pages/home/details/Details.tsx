import { Hex } from '@gear-js/api';
// import { Button } from '@gear-js/ui';
import { BackButton, Detail } from 'components';
import { SVGType } from 'types';
import styles from './Details.module.scss';

type Props = {
  heading: string;
  game: string;
  round: string;
  contract: Hex | undefined;
  bet: string | undefined;
  entry: string | undefined;
  move: string | undefined;
  reveal: string | undefined;
  SVG: SVGType;
  players: Array<Hex>
  onBackClick: (arg: string) => void;
};



function Details({ onBackClick, heading, game, round, contract, players, bet, entry, move, reveal, SVG }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.visual}>
        <BackButton onClick={() => onBackClick('lobby')} />
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
          <Detail label="Players" text={players.length.toString()} className={styles.players} />
          <Detail label="Bet size" className={styles.bet}>
            <span className={styles.betText}>{bet}</span>
          </Detail>
          {entry && <Detail label="Entry timeout" text={entry} className={styles.entry} />}
          {move && <Detail label="Move timeout" text={move} className={styles.move} />}
          {reveal && <Detail label="Reveal timeout" text={reveal} className={styles.reveal} />}
        </div>
        <div className={styles.lobby}>
          <span className={styles.lobbyTitle}>lobby:</span>
          {players.map(player => <span className={styles.lobbyText} key={player}>{player}</span>)}
        </div>
      </div>
    </div>
  );
}

export { Details };
