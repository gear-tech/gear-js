import { Hex } from '@gear-js/api';
import { GameResult } from './game-result';
import { RoundResult } from './round-result';

type Props = {
  programID: Hex | string;
  round: string;
  lobbyList: Hex[] | string[];
  loosers: Hex[];
  winner: Hex;
  account: Hex;
  nextRoundPlayer: any;
  setRoute: (arg: string) => void;
};

function Result({ programID, round, lobbyList, loosers, setRoute, nextRoundPlayer, winner, account }: Props) {
  return lobbyList?.length ? (
    <RoundResult
      name=""
      game={programID}
      round={round}
      winners={lobbyList as []}
      loosers={loosers}
      onClickRoute={setRoute}
      nextRound={nextRoundPlayer}
    />
  ) : (
    <GameResult
      name=""
      game={programID}
      winner={winner || ('' as Hex)}
      loosers={loosers}
      account={account || ('' as Hex)}
      onClickClose={() => setRoute('')}
    />
  );
}

export { Result };
