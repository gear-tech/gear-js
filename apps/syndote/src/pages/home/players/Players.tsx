import { Hex } from '@gear-js/api';
import { PlayerState, PlayerType } from 'types';
import { Player } from '../player';
import styles from './Players.module.scss';

type Props = {
  list: (PlayerState & PlayerType)[];
  winner: Hex;
};

function Players({ list, winner }: Props) {
  const getPlayers = () =>
    list.map(({ color, address, balance, lost }) => (
      <Player
        key={color}
        color={color}
        address={address}
        balance={balance}
        isWinner={winner === address}
        isLoser={lost}
      />
    ));

  return (
    <div>
      <h2 className={styles.heading}>Player list</h2>
      <div>{getPlayers()}</div>
    </div>
  );
}

export { Players };
