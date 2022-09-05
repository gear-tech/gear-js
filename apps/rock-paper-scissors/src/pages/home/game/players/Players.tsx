import { Hex } from '@gear-js/api';
import { ReactComponent as IdSVG } from 'assets/images/icons/id.svg';
import { ReactComponent as MedalSVG } from 'assets/images/icons/medal.svg';
import { Checkbox } from '@gear-js/ui';
import styles from './Players.module.scss';

type Props = {
  list: Hex[];
};

function Players({ list }: Props) {
  const getPlayers = () =>
    list.map((player) => (
      <li key={player} className={styles.row}>
        <span className={styles.player}>{player}</span>
        <Checkbox label="" className={styles.checkbox} readOnly />
      </li>
    ));

  return (
    <>
      <h3 className={styles.heading}>Current players</h3>
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
      <ul className={styles.list}>{getPlayers()}</ul>
    </>
  );
}

export { Players };
