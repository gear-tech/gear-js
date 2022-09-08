import { Hex } from '@gear-js/api';
import clsx from 'clsx';
import { BackButton } from 'components';
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
};

function Details({ heading, game, round, contract, players, bet, entry, move, reveal }: Props) {
  return (
    <div className={styles.container}>
      <BackButton />
      <h2 className={styles.heading}>{heading}</h2>
    </div>
  );
}

export { Details };
