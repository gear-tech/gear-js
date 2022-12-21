import { Hex } from '@gear-js/api';
import { BackButton, Detail, Loader } from 'components';
import { SVGType } from 'types';
import { handleRouteChange } from 'utils';
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
  isLoading: boolean;
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
  isLoading,
}: Props) {
  const playersAmount = players?.length.toString() || '0';

  const getPlayers = () =>
    players?.map((player) => (
      <span className={styles.lobbyText} key={player}>
        {player}
      </span>
    )) || '0';

  return isLoading ? (
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
          {entry && <Detail label="Entry timeout" text={entry.slice(0, -4)} className={styles.entry} />}
          {move && <Detail label="Move timeout" text={move.slice(0, -4)} className={styles.move} />}
          {reveal && <Detail label="Reveal timeout" text={reveal.slice(0, -4)} className={styles.reveal} />}
        </div>
        <div className={styles.lobby}>
          <span className={styles.lobbyTitle}>lobby:</span>
          {getPlayers()}
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
}

export { Details };
