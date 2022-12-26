import { Hex } from '@gear-js/api';
import { BackButton, Detail } from 'components';
import { SVGType } from 'types';
import { handleRouteChange } from 'utils';
import styles from './Details.module.scss';

type Props = {
  heading: string;
  game: string;
  round: string;
  contract: Hex;
  bet: string;
  entry: string;
  move: string;
  reveal: string;
  SVG: SVGType;
  admin?: boolean;
  players?: Array<Hex> | Array<string> | [];
  onRouteChange: (arg: string) => void;
};

function Details({
  onRouteChange,
  heading,
  game,
  round,
  contract,
  players,
  bet,
  entry,
  move,
  reveal,
  SVG,
  admin,
}: Props) {
  const playersAmount = players?.length.toString() || '0';
  const getPlayers = () =>
    players?.map((player) => (
      <span className={styles.lobbyText} key={player}>
        {player}
      </span>
    )) || '0';

  return (
    <div className={styles.container}>
      <div className={styles.visual}>
        <BackButton onClick={() => handleRouteChange(admin, onRouteChange)} />
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
          <Detail label="Players" text={playersAmount} className={styles.players} />
          <Detail label="Bet size" className={styles.bet}>
            <span className={styles.betText}>{bet}</span>
          </Detail>
          <Detail label="Entry timeout" text={entry} className={styles.entry} />
          <Detail label="Move timeout" text={move} className={styles.move} />
          <Detail label="Reveal timeout" text={reveal} className={styles.reveal} />
        </div>
        <div className={styles.lobby}>
          <span className={styles.lobbyTitle}>lobby:</span>
          {getPlayers()}
        </div>
      </div>
    </div>
  );
}

export { Details };
