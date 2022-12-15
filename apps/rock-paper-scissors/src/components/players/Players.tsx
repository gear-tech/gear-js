import { useMemo } from 'react';
import { ReactComponent as IdSVG } from 'assets/images/icons/id.svg';
import { ReactComponent as MedalSVG } from 'assets/images/icons/medal.svg';
import { Checkbox } from '@gear-js/ui';
import clsx from 'clsx';
import styles from './Players.module.scss';

type Props = {
  heading: string;
  list?: string[];
  finishedPlayers?: string[];
  className?: string;
  center?: boolean;
};

function Players({  heading, list, finishedPlayers, className, center }: Props) {
  
  const headingClassName = clsx(styles.heading, center && styles.center);
  const listClassName = clsx(styles.list, className);

  const getPlayers = useMemo(() =>
    list && list.map((player) => (
      <li key={player} className={styles.row}>
        <span className={styles.player}>{player}</span>
        <Checkbox checked={finishedPlayers?.includes(player)} label="" className={styles.checkbox} readOnly />
      </li>
    )), [list, finishedPlayers]);

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
      <ul className={listClassName}>{getPlayers}</ul>
    </>
  );
}

export { Players };
