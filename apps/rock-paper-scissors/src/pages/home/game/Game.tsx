import { useMemo } from 'react'
import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { BackButton, Detail, Players, Stage } from 'components';
import { StageType } from 'types';
import { Countdown } from './countdown';
import styles from './Game.module.scss';

type Props = {
  onRouteChange: (arg: string) => void;
  account?: Hex | undefined;
  heading: string;
  stage?: StageType | '';
  bet: string | undefined;
  game: string;
  round: string;
  players?: Array<Hex> | Array<string> | [];
  finishedPlayers?: Array<Hex> | Array<string> | undefined;
  hoursLeft: string;
  minutesLeft: string;
  secondsLeft: string;
  admin?: boolean
};


function Game({ onRouteChange, account, players, finishedPlayers, heading, stage, bet, game, round, hoursLeft, minutesLeft, secondsLeft, admin }: Props) {

  const handleRouteChange = () => admin ? onRouteChange('detail admin') : onRouteChange('detail')

  const getButton = useMemo(() => {
    if (stage === "preparation") return;
    if (finishedPlayers?.includes(account as Hex)) return;
    if (stage === 'progress') {
      return <Button onClick={() => onRouteChange('move')} text="Make a move" size="large" className={styles.actionButton} />
    };
    if (stage === 'reveal') {
      return <Button onClick={() => onRouteChange('reveal')} text="Reveal" size="large" className={styles.actionButton} />
    };
  }, [onRouteChange, stage, finishedPlayers, account]);
  
  return (
    <div className={styles.container}>
      <div className={styles.players}>
        <BackButton onClick={() => onRouteChange('')} />
        <Players
          finishedPlayers={finishedPlayers as string[]}
          list={players as string[]}
          heading="Current players" />
        {!admin && getButton}
      </div>
      <div className={styles.summary}>
        <h2 className={styles.heading}>{heading}</h2>
        <div className={styles.summaryMain}>
          <Detail label="Time left" direction="x" className={styles.time}>
            <Countdown hours={hoursLeft} minutes={minutesLeft} seconds={secondsLeft} />
          </Detail>
          <Detail label="Stage" className={styles.stage}>
            <Stage value={stage} />
          </Detail>
          <Detail label="Bet size" className={styles.bet}>
            <span className={styles.text}> <span className={styles.bet}>{bet}</span> Unit </span>
          </Detail>
          <Detail label="Current game" text={game} className={styles.game} />
          <Detail label="Current round" text={round} className={styles.round} />
        </div>
        <Button text="Details" color="light" size="large" onClick={handleRouteChange} className={styles.detailsButton} />
        {admin &&
          <Button text="Edit next game" color="light" size="large" onClick={() => onRouteChange('create')} />
        }
      </div>
    </div>
  );
}

export { Game };
