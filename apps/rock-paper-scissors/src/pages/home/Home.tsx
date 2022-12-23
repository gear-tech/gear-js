import { useState, useMemo, useEffect } from 'react';
import {
  /* useWasm, */ useMsToTime,
  useRockPaperScissors,
  useCreateRockPaperScissors,
  useRockPaperScissorsMessage,
  useRoute
} from 'hooks';
import { onClickRegister, gameStageFinishedPlayers, getGameStage, getLoosers } from 'utils';
import { ApiLoader } from 'components';
import { UserMoveType } from 'types';
import { useAccount, useMetadata } from '@gear-js/react-hooks';
import { Hex } from '@gear-js/api';
import { Create } from './create';
import { Start } from './start';
import { Game } from './game';
import { Details } from './details';
import { Join } from './join';
import { JoinDetails } from './joinDetails';
import { Move } from './move';
import { ReactComponent as GearBgSVG } from '../../assets/images/backgrounds/gearBG.svg';
import { ReactComponent as LizardBgSVG } from '../../assets/images/backgrounds/lizard.svg';
import { Reveal } from './reveal';
import { RoundResult } from './round-result';
import { GameResult } from './game-result';

import metaAssets from '../../assets/metaWasm/rock_paper_scissors.meta.wasm';

function Home() {
  const [programID, setProgramID] = useState('' as Hex);
  const [loading, setLoading] = useState(false);
  const [userMove, setUserMove] = useState<UserMoveType>();
  const [prevLobbyList, setPrevLobbyList] = useState<Hex[]>([]);

  const create = useCreateRockPaperScissors();
  const payloadSend = useRockPaperScissorsMessage(programID);

  const { account } = useAccount();
  const { route, setRoute } = useRoute();

  // temporary
  const { metaBuffer } = useMetadata(metaAssets);
  // const { metaBuffer } = useWasm();

  const { gameState, gameStageState, lobbyState, timeLeft, winnerState, roundState } = useRockPaperScissors(
    programID,
    metaBuffer,
  );
  const { state } = gameState;
  const { betSize, moveTimeoutMs, revealTimeoutMs, entryTimeoutMs, playersCountLimit } = state?.Config || {};
  const { minutes, hours, seconds } = useMsToTime(timeLeft.state?.Deadline);

  const lobbyList = lobbyState.state?.LobbyList;
  const isLoading = gameStageState.isStateRead;
  const accountHex = account?.decodedAddress;
  const round = (Number(roundState.state?.CurrentRound) + 1).toString();
  const gameStageData: any = useMemo(() => gameStageState.state?.GameStage, [gameStageState.state?.GameStage]);

  const { gameStage } = getGameStage(gameStageData);

  const { finishedPlayers } = gameStageFinishedPlayers(gameStageData);

  const { loosers } = getLoosers(prevLobbyList, lobbyList, winnerState);

  const nextRoundPlayer = !loosers.includes(accountHex as Hex);

  useEffect(() => {
    if (lobbyList?.length && Object.keys(gameStageData).includes('Reveal')) setPrevLobbyList([...(lobbyList as [])]);
  }, [lobbyList, gameStageData]);

  useEffect(() => {
    const betSizeToNumber = Number(betSize?.split(',').join(''));
    if (gameState.error && loading) {
      setLoading(false);
      setRoute('join');
    }
    if (betSizeToNumber > 500) {
      setLoading(false);
    }
  }, [gameState.error, setRoute, loading, betSize]);

  const onClickCreate = (hex: Hex) => {
    setRoute('lobby admin');
    setProgramID(hex);
  };

  const getResult = () => {
    if (lobbyList?.length) {
      return (
        <RoundResult
          name=""
          game={programID}
          round={round}
          winners={lobbyList as []}
          loosers={loosers}
          onClickRoute={setRoute}
          nextRound={nextRoundPlayer}
        />
      );
    }
    return (
      <GameResult
        name=""
        game={programID}
        winner={winnerState.state?.Winner || ('' as Hex)}
        loosers={loosers}
        account={accountHex || ('' as Hex)}
        onClickClose={() => setRoute('')}
      />
    );
  };

  return loading ? (
    <ApiLoader />
  ) : (
    <>
      {!route && <Start onClickRouteChange={setRoute} setProgramID={setProgramID} />}

      {route === 'create' && (
        <Create
          setLoading={setLoading}
          onRouteChange={setRoute}
          onSubmit={create}
          setStateAction={onClickCreate}
        />
      )}

      {route === 'join' && <Join onClickRouteChange={setRoute} setProgramID={setProgramID} />}

      {route === 'Join game' && (
        <JoinDetails
          clearProgrammId={setProgramID}
          onRouteChange={setRoute}
          onClickRegister={() =>
            onClickRegister(setRoute, payloadSend, lobbyList as Hex[], accountHex as Hex, betSize as string)
          }
          round={round}
          game="current game"
          heading={programID}
          bet={betSize}
          contract={programID}
          players={playersCountLimit || ''}
          move={moveTimeoutMs}
          reveal={revealTimeoutMs}
          entry={entryTimeoutMs}
          SVG={LizardBgSVG}
          hoursLeft={hours}
          minutesLeft={minutes}
          secondsLeft={seconds}
          isLoading={isLoading}
        />
      )}
      {route === 'lobby admin' && (
        <Game
          players={lobbyList}
          finishedPlayers={finishedPlayers}
          onRouteChange={setRoute}
          heading={programID}
          stage={gameStage}
          bet={betSize}
          game="current game"
          round={round}
          hoursLeft={hours}
          minutesLeft={minutes}
          secondsLeft={seconds}
          admin
        />
      )}
      {route === 'game' && (
        <Game
          players={lobbyList}
          finishedPlayers={finishedPlayers}
          onRouteChange={setRoute}
          heading="Rock Paper Scissors"
          stage={gameStage}
          bet={betSize}
          game={programID}
          round={round}
          hoursLeft={hours}
          minutesLeft={minutes}
          secondsLeft={seconds}
          account={accountHex}
        />
      )}
      {route === 'detail' && (
        <Details
          heading={programID}
          game="current game"
          round={round}
          bet={betSize}
          players={lobbyList}
          contract={programID}
          move={moveTimeoutMs}
          reveal={revealTimeoutMs}
          entry={entryTimeoutMs}
          SVG={GearBgSVG}
          onRouteChange={setRoute}
          isLoading={isLoading}
        />
      )}
      {route === 'detail admin' && (
        <Details
          heading={programID}
          game=""
          round={round}
          bet={betSize}
          players={lobbyList}
          contract={programID}
          move={moveTimeoutMs}
          reveal={revealTimeoutMs}
          entry={entryTimeoutMs}
          SVG={GearBgSVG}
          onRouteChange={setRoute}
          admin
          isLoading={isLoading}
        />
      )}

      {route === 'move' && (
        <Move
          payloadSend={payloadSend}
          onRouteChange={setRoute}
          userMove={userMove || ({} as UserMoveType)}
          setUserMove={setUserMove}
        />
      )}

      {route === 'reveal' && (
        <Reveal userMove={userMove || {}} payloadSend={payloadSend} onRouteChange={setRoute} />
      )}

      {route === 'round result' &&
        (gameStageData?.Reveal ? (
          <Game
            players={lobbyList}
            finishedPlayers={finishedPlayers}
            onRouteChange={setRoute}
            heading="somth heading"
            stage={gameStage}
            bet={betSize}
            game={programID}
            round={round}
            hoursLeft={hours}
            minutesLeft={minutes}
            secondsLeft={seconds}
          />
        ) : (
          getResult()
        ))}
    </>
  );
}

export { Home };
