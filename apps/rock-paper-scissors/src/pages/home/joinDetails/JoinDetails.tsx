import { BackButton, Detail, Loader } from 'components';
import { Button } from '@gear-js/ui';
import { SVGType } from 'types';
import { Hex } from '@gear-js/api';

import styles from './JoinDetails.module.scss';

type Props = {
  onRouteChange: (arg: string) => void;
  onClickRegister?: (arg: any) => void;
  clearProgrammId: (arg: Hex) => void;
  heading: string;
  bet: string;
  game: string;
  round: string;
  players: string;
  SVG: SVGType;
  entry: string;
  move: string;
  reveal: string;
  contract: Hex;
  hoursLeft: string;
  minutesLeft: string;
  secondsLeft: string;
};

function JoinDetails({
  onRouteChange,
  onClickRegister,
  clearProgrammId,
  hoursLeft,
  minutesLeft,
  secondsLeft,
  round,
  game,
  heading,
  bet,
  players,
  entry,
  move,
  reveal,
  SVG,
  contract,
}: Props) {
  const timeLeftToString = secondsLeft !== 'NaN' ? `Register ${hoursLeft}:${minutesLeft}:${secondsLeft}` : 'Register';
  return (
    <div className={styles.container}>
      <div className={styles.visual}>
        <BackButton
          onClick={() => {
            onRouteChange('join');
            clearProgrammId('' as Hex);
          }}
        />
        <SVG className={styles.svg} />
      </div>
      {secondsLeft ? (
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
            <Button className={styles.register} text={timeLeftToString} block onClick={onClickRegister} />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export { JoinDetails };
