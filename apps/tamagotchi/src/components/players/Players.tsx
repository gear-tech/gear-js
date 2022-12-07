import { Hex } from '@gear-js/api';
import { ReactComponent as IdSVG } from 'assets/images/icons/id.svg';
import { ReactComponent as MedalSVG } from 'assets/images/icons/medal.svg';
import { Checkbox } from '@gear-js/ui';
import clsx from 'clsx';
import styles from './Players.module.scss';

type Props = {
  heading: string;
  list: Hex[];
  className?: string;
  center?: boolean;
};

function Players({ heading, list, className, center }: Props) {
  const headingClassName = clsx(styles.heading, center && styles.center);
  const listClassName = clsx(styles.list, className);

  const getPlayers = () =>
    list.map((player) => (
      <li key={player} className={styles.row}>
        <span className={styles.player}>{player}</span>
        <Checkbox label="" className={styles.checkbox} readOnly />
      </li>
    ));

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
      <ul className={listClassName}>{getPlayers()}</ul>
    </>
  );
}

export { Players };
