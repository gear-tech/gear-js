import clsx from 'clsx';
import styles from './PlayerStatus.module.scss';

type Props = {
  isWinner: boolean;
};

function PlayerStatus({ isWinner }: Props) {
  const className = clsx(styles.status, isWinner ? styles.win : styles.lose);

  return (
    <div className={className}>
      <p>{isWinner ? 'Congrats, you won!' : 'Sorry, you lost :C'}</p>
    </div>
  );
}

export { PlayerStatus };
