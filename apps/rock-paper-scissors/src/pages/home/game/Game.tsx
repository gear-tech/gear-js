import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { BackButton, Stage } from 'components';
import { StageType } from 'types';
import { Countdown } from './countdown';
import { Players } from './players';
import styles from './Game.module.scss';

type Props = {
  name: string;
  stage: StageType;
  bet: string;
  game: string;
  round: string;
};

const players = ['0x00', '0x00', '0x00', '0x00', '0x00', '0x00'];

function Game({ name, stage, bet, game, round }: Props) {
  const timeLabelClassName = clsx(styles.label, styles.timeLabel);

  return (
    <div className={styles.container}>
      <div className={styles.players}>
        <BackButton />
        <Players list={players as Hex[]} />
        <Button text="Reveal" size="large" className={styles.actionButton} />
      </div>
      <div className={styles.summary}>
        <h2 className={styles.heading}>{name}</h2>
        <div className={styles.summaryMain}>
          <div className={styles.time}>
            <span className={timeLabelClassName}>Time left:</span>
            <Countdown hours="00" minutes="00" seconds="00" />
          </div>
          <div className={clsx(styles.stage, styles.column)}>
            <span className={styles.label}>Stage:</span>
            <Stage value={stage} />
          </div>
          <div className={clsx(styles.bet, styles.column)}>
            <span className={styles.label}>Bet size:</span>
            <span className={styles.bet}>{bet}</span>
          </div>
          <div className={clsx(styles.game, styles.column)}>
            <span className={styles.label}>Current game:</span>
            <span>{game}</span>
          </div>
          <div className={clsx(styles.round, styles.column)}>
            <span className={styles.label}>Current round:</span>
            <span>{round}</span>
          </div>
        </div>
        <Button text="Details" color="light" size="large" className={styles.detailsButton} />
        <Button text="Leave the game" color="light" size="large" />
      </div>
    </div>
  );
}

export { Game };
