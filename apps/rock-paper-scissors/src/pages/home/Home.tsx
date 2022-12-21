import { useState, useMemo, useEffect } from 'react';
import {
  /* useWasm, */ useMsToTime,
  useRockPaperScissors,
  useCreateRockPaperScissors,
  useRockPaperScissorsMessage,
} from 'hooks';
import { useForm, onClickRegister, gameStageFinishedPlayers, getGameStage, getLoosers } from 'utils';
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
  const { form, onClickRouteChange } = useForm();

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
      onClickRouteChange('join');
    }
    if (betSizeToNumber > 500) {
      setLoading(false);
    }
  }, [gameState.error, onClickRouteChange, loading, betSize]);

  const onClickCreate = (hex: Hex) => {
    onClickRouteChange('lobby admin');
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
          onClickRoute={onClickRouteChange}
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
        onClickClose={() => onClickRouteChange('')}
      />
    );
  };

  return loading ? (
    <ApiLoader />
  ) : (
    <>
      {!form && <Start onClickRouteChange={onClickRouteChange} setProgramID={setProgramID} />}

      {form === 'create' && (
        <Create
          setLoading={setLoading}
          onRouteChange={onClickRouteChange}
          onSubmit={create}
          setStateAction={onClickCreate}
        />
      )}

      {form === 'join' && <Join onClickRouteChange={onClickRouteChange} setProgramID={setProgramID} />}

      {form === 'Join game' && (
        <JoinDetails
          clearProgrammId={setProgramID}
          onRouteChange={onClickRouteChange}
          onClickRegister={() =>
            onClickRegister(
              onClickRouteChange,
              payloadSend,
              lobbyList || ([] as Hex[]),
              accountHex || ('' as Hex),
              betSize || ('' as Hex),
            )
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
      {form === 'lobby admin' && (
        <Game
          players={lobbyList}
          finishedPlayers={finishedPlayers}
          onRouteChange={onClickRouteChange}
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
      {form === 'game' && (
        <Game
          players={lobbyList}
          finishedPlayers={finishedPlayers}
          onRouteChange={onClickRouteChange}
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
      {form === 'detail' && (
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
          onRouteChange={onClickRouteChange}
          isLoading={isLoading}
        />
      )}
      {form === 'detail admin' && (
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
          onRouteChange={onClickRouteChange}
          admin
          isLoading={isLoading}
        />
      )}

      {form === 'move' && (
        <Move
          payloadSend={payloadSend}
          onRouteChange={onClickRouteChange}
          userMove={userMove || ({} as UserMoveType)}
          setUserMove={setUserMove}
        />
      )}

      {form === 'reveal' && (
        <Reveal userMove={userMove || {}} payloadSend={payloadSend} onRouteChange={onClickRouteChange} />
      )}

      {form === 'round result' &&
        (gameStageData?.Reveal ? (
          <Game
            players={lobbyList}
            finishedPlayers={finishedPlayers}
            onRouteChange={onClickRouteChange}
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
