import clsx from 'clsx';
import { EMPTY_GAMES } from 'consts';
import styles from './Games.module.scss';

type Props = {
  heading: string;
  list: any[];
};

function Games({ heading, list }: Props) {
  const isAnyGame = list.length > 0;
  const games = isAnyGame ? list : EMPTY_GAMES;

  const headerClassName = clsx(styles.row, styles.header);

  const getGames = () =>
    games.map(({ name, players, bet, game, round, stage, action }) => {
      const stageClassName = clsx(styles.stage, styles[stage]);

      return (
        <li className={styles.row}>
          <span>{name}</span>
          <span>{players}</span>
          <span>{bet}</span>
          <span>{game}</span>
          <span>{round}</span>
          <div>
            <span className={stageClassName}>{stage}</span>
          </div>
          <span>{action}</span>
        </li>
      );
    });

  return (
    <div className={styles.games}>
      <h3 className={styles.heading}>{heading}</h3>
      <header className={headerClassName}>
        <span>Game</span>
        <span>Players</span>
        <span>Bet</span>
        <span>Current game</span>
        <span>Current round</span>
        <span>Game stage</span>
        <span />
      </header>
      <div className={styles.body}>
        <ul>{getGames()}</ul>
        {!isAnyGame && <p className={styles.empty}>There are no games at the moment</p>}
      </div>
    </div>
  );
}

export { Games };
