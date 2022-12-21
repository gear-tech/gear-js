import clsx from 'clsx';
import { Hex } from '@gear-js/api';
import { ReactComponent as IdSVG } from 'assets/images/icons/id.svg';
import { ReactComponent as MedalSVG } from 'assets/images/icons/medal.svg';
import { Player } from './player';
import styles from './Players.module.scss';

type Props = {
  heading: string;
  list: Hex[];
  finishedPlayers?: string[];
  className?: string;
  center?: boolean;
};

function Players({ heading, list, finishedPlayers, className, center }: Props) {
  const headingClassName = clsx(styles.heading, center && styles.center);
  const listClassName = clsx(styles.list, className);

  return (
    <>
      <h3 className={headingClassName}>{heading}</h3>
      <header className={styles.header}>
        <div className={styles.cell}>
          <IdSVG className={styles.icon} />
          Account ID
        </div>
        <div className={styles.cell}>
          <MedalSVG className={styles.icon} />
          Moved
        </div>
      </header>
      <ul className={listClassName}>
        {list.length &&
          list.map((player) => (
            <Player key={player} id={player as Hex} isFinished={finishedPlayers?.includes(player) || false} />
          ))}
      </ul>
    </>
  );
}

export { Players };
