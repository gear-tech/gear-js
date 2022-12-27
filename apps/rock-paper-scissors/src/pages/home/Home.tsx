import { useState, useMemo, useEffect } from 'react';
import {
  /* useWasm, */
  useMsToTime,
  useRockPaperScissors,
  useCreateRockPaperScissors,
  useRockPaperScissorsMessage,
  useRoute,
} from 'hooks';
import { onClickRegister, gameStageFinishedPlayers, getGameStageText, getLoosers, getButtonVisible } from 'utils';
import { ApiLoader } from 'components';
import { GameStageType, StageType, StateWinnerType, UserMoveType } from 'types';
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
import { Result } from './result';

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

  const { gameStageState, gameStateError, gameState, lobbyState, timeLeft, winnerState, roundState } =
    useRockPaperScissors(programID, metaBuffer as Buffer);

  const { betSize, moveTimeoutS, revealTimeoutS, entryTimeoutS, playersCountLimit } = gameState;
  const { minutes, hours, seconds } = useMsToTime(timeLeft?.Deadline);
  const { gameStageText } = getGameStageText(gameStageState as StageType);

  const lobbyList = lobbyState?.LobbyList;
  const accountHex = useMemo(() => account?.decodedAddress, [account]);
  const round = (Number(roundState?.CurrentRound) + 1).toString();

  const { finishedPlayers } = gameStageFinishedPlayers(gameStageState as GameStageType);
  const finishedAccount = finishedPlayers?.includes(accountHex as Hex);

  const { loosers } = getLoosers(prevLobbyList, lobbyList, winnerState as StateWinnerType);
  const nextRoundPlayer = !loosers.includes(accountHex as Hex);
  const { buttonVisible } = getButtonVisible(gameStageText, finishedAccount);

  useEffect(() => {
    if ((gameStageText as string) === 'reveal') setPrevLobbyList(lobbyList as Hex[]);
  }, [lobbyList, gameStageText]);

  useEffect(() => {
    if (gameStateError) {
      setProgramID('' as Hex);
      setLoading(false);
      setRoute('join');
    }
    if (betSize) {
      setLoading(false);
    }
  }, [gameStateError, setRoute, betSize]);

  const onClickCreate = (hex: Hex) => {
    setRoute('lobby admin');
    setProgramID(hex);
  };
  const onClickStart = () => {
    setProgramID('' as Hex);
    setRoute('create');
  };
  const onClickJoin = () => {
    setProgramID('' as Hex);
    setRoute('join');
  };

  return loading ? (
    <ApiLoader />
  ) : (
    <>
      {!route && <Start onClickCreate={onClickStart} onClickJoin={onClickJoin} />}

      {route === 'create' && (
        <Create setLoading={setLoading} onRouteChange={setRoute} onSubmit={create} setStateAction={onClickCreate} />
      )}

      {route === 'join' && <Join onClickRouteChange={setRoute} setProgramID={setProgramID} setLoading={setLoading} />}

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
          move={moveTimeoutS}
          reveal={revealTimeoutS}
          entry={entryTimeoutS}
          SVG={LizardBgSVG}
          hoursLeft={hours}
          minutesLeft={minutes}
          secondsLeft={seconds}
        />
      )}
      {route === 'lobby admin' && (
        <Game
          players={lobbyList}
          finishedPlayers={finishedPlayers}
          onRouteChange={setRoute}
          heading={programID}
          stage={gameStageText}
          bet={betSize}
          game="current game"
          round={round}
          hoursLeft={hours}
          minutesLeft={minutes}
          secondsLeft={seconds}
          onClickDetail={() => setRoute('detail admin')}
          buttonVisible={false}
          admin
        />
      )}
      {route === 'game' && (
        <Game
          players={lobbyList}
          finishedPlayers={finishedPlayers}
          onRouteChange={setRoute}
          heading="Rock Paper Scissors"
          stage={gameStageText}
          bet={betSize}
          game={programID}
          round={round}
          hoursLeft={hours}
          minutesLeft={minutes}
          secondsLeft={seconds}
          buttonVisible={buttonVisible}
          onClickDetail={() => setRoute('detail')}
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
          move={moveTimeoutS}
          reveal={revealTimeoutS}
          entry={entryTimeoutS}
          SVG={GearBgSVG}
          onRouteChange={setRoute}
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
          move={moveTimeoutS}
          reveal={revealTimeoutS}
          entry={entryTimeoutS}
          SVG={GearBgSVG}
          onRouteChange={setRoute}
          admin
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
        <Reveal userMove={userMove as UserMoveType} payloadSend={payloadSend} onRouteChange={setRoute} />
      )}

      {route === 'round result' &&
        (gameStageText === 'reveal' ? (
          <Game
            players={lobbyList}
            finishedPlayers={finishedPlayers}
            onRouteChange={setRoute}
            heading="somth heading"
            stage={gameStageText}
            bet={betSize}
            game={programID}
            round={round}
            hoursLeft={hours}
            minutesLeft={minutes}
            secondsLeft={seconds}
            buttonVisible={buttonVisible}
            onClickDetail={() => setRoute('detail')}
          />
        ) : (
          <Result
            programID={programID}
            lobbyList={lobbyList as Hex[]}
            winner={winnerState?.Winner as Hex}
            loosers={loosers}
            round={round}
            account={accountHex as Hex}
            nextRoundPlayer={nextRoundPlayer}
            setRoute={setRoute}
          />
        ))}
    </>
  );
}

export { Home };
