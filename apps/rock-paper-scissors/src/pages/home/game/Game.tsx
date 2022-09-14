import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { BackButton, Detail, Players, Stage } from 'components';
import { StageType } from 'types';
import { Countdown } from './countdown';
import styles from './Game.module.scss';

type Props = {
  heading: string;
  stage: StageType;
  bet: string;
  game: string;
  round: string;
};

const players = ['0x00', '0x00', '0x00', '0x00', '0x00', '0x00'];

function Game({ heading, stage, bet, game, round }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.players}>
        <BackButton onClick={() => {}} />
        <Players list={players as Hex[]} heading="Current players" />
        <Button text="Reveal" size="large" className={styles.actionButton} />
      </div>
      <div className={styles.summary}>
        <h2 className={styles.heading}>{heading}</h2>
        <div className={styles.summaryMain}>
          <Detail label="Time left" direction="x" className={styles.time}>
            <Countdown hours="00" minutes="00" seconds="00" />
          </Detail>
          <Detail label="Stage" className={styles.stage}>
            <Stage value={stage} />
          </Detail>
          <Detail label="Bet size" className={styles.bet}>
            <span className={styles.bet}>{bet}</span>
          </Detail>
          <Detail label="Current game" text={game} className={styles.game} />
          <Detail label="Current round" text={round} className={styles.round} />
        </div>
        <Button text="Details" color="light" size="large" className={styles.detailsButton} />
        <Button text="Leave the game" color="light" size="large" />
      </div>
    </div>
  );
}

export { Game };
