import clsx from 'clsx';
import { Buttons } from '../buttons';
import styles from './Roll.module.scss';

type Props = {
  color: string | undefined;
  player: string;
  currentTurn: number;
  turnsAmount: number;
  onFirstClick?: () => void;
  onPrevClick?: () => void;
  onMainClick?: () => void;
  onNextClick?: () => void;
  onLastClick?: () => void;
};

function Roll({
  color,
  player,
  currentTurn,
  turnsAmount,
  onFirstClick,
  onPrevClick,
  onMainClick,
  onNextClick,
  onLastClick,
}: Props) {
  return (
    <>
      <p className={clsx(styles.turnPlayer, color && styles[color])}>
        <span className={styles.player}>{player}</span> Turn
      </p>
      <div className={styles.disk}>
        <h2 className={styles.heading}>Master Rolls</h2>

        <div className={styles.roll}>{currentTurn}</div>

        <Buttons
          onFirstClick={onFirstClick}
          onPrevClick={onPrevClick}
          onMainClick={onMainClick}
          onNextClick={onNextClick}
          onLastClick={onLastClick}
        />
      </div>
      <div className={styles.turnCounter}>
        Turn <span>{currentTurn}</span> of {turnsAmount}
      </div>
    </>
  );
}

export { Roll };
