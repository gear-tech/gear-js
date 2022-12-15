import { useState, useMemo, useEffect, useRef } from 'react';
import { useWasm, useMsToTime } from 'hooks';
import { useForm } from 'utils';
import { ApiLoader, Stage } from 'components';
import {
  StateConfigType,
  StateTimeStampType,
  StateGameStageType,
  StateLobbyType,
  StageType,
  StateTimeLeftType,
  PlayersMoveType,
  SVGType,
  StateRoundType,
  StateWinnerType
} from 'types';
import {
  useAccount,
  useCreateHandler,
  useMetadata,
  useReadState,
  useSendMessage
} from '@gear-js/react-hooks';
import { blake2AsHex } from '@polkadot/util-crypto';
import { stringToU8a, } from '@polkadot/util';
import { Hex } from '@gear-js/api';

import { Create } from './create';
import { Start } from './start';
import { Game } from './game';
import { Details } from './details';
import { Join } from './join'
import { JoinDetails } from './joinDetails';
import { Move } from './move';
import { ReactComponent as GearBgSVG } from '../../assets/images/backgrounds/gearBG.svg'
import { ReactComponent as LizardBgSVG } from '../../assets/images/backgrounds/lizard.svg'
import { Reveal } from './reveal';
import { RoundResult } from './round-result';
import { GameResult } from './game-result';
import metaAssets from '../../assets/metaWasm/rock_paper_scissors.meta.wasm'


// function useCreateRockPaperScissors() {
//   const { codeHash, meta } = useWasm();
//   return useCreateHandler(codeHash, meta);
// }

// function useMessage(programID: Hex) {
//   const { meta } = useWasm();
//   return useSendMessage(programID, meta)
// }

//  temporary 

function useCreateRockPaperScissors() {
  const newHesh = process.env.REACT_APP_CODE_ADDRESS as Hex
  const { metadata } = useMetadata(metaAssets)
  return useCreateHandler(newHesh, metadata);
}

function useMessage(programID: Hex) {
  return useSendMessage(programID, metaAssets)
}


const useConfig = (programID: Hex, metaBuffer: any) => {

  const configState = useMemo(() => ({ Config: null }), []);
  const configGameStage = useMemo(() => ({ GameStage: null }), []);
  const configLobby = useMemo(() => ({ LobbyList: null }), []);
  const configTime = useMemo(() => ({ Deadline: null }), []);
  const configPlayerMoves = useMemo(() => ({ PlayerMoves: null }), []);
  const configWinner = useMemo(() => ({ Winner: null }), []);
  const configRound = useMemo(() => ({ CurrentRound: null }), []);

  const gameState = useReadState<StateConfigType>(programID, metaBuffer, configState,);
  const gameStageState = useReadState<StateGameStageType>(programID, metaBuffer, configGameStage);
  const lobbyState = useReadState<StateLobbyType>(programID, metaBuffer, configLobby);
  const winnerState = useReadState<StateWinnerType>(programID, metaBuffer, configWinner);
  const timeLeft = useReadState<StateTimeLeftType>(programID, metaBuffer, configTime);
  const playerMoves = useReadState<PlayersMoveType>(programID, metaBuffer, configPlayerMoves);
  const roundState = useReadState<StateRoundType>(programID, metaBuffer, configRound);

  return { gameState, gameStageState, lobbyState, timeLeft, playerMoves, winnerState, roundState }
}

function Home() {
  const { account } = useAccount();
  const accountHex = account?.decodedAddress;

  const [programID, setProgramID] = useState('' as Hex);
  const [loading, setLoading] = useState(false);
  const [move, setMove] = useState<{ name: string, id?: string, SVG?: SVGType }>({ name: '' });
  const [prevLobbyList, setPrevLobbyList] = useState<Hex[]>([]);
  const { form, onClickRouteChange } = useForm();
  const create = useCreateRockPaperScissors();

  // temporary 
  const { metaBuffer } = useMetadata(metaAssets);
  // const { metaBuffer } = useWasm();  

  const { gameState, gameStageState, lobbyState, timeLeft, playerMoves, winnerState, roundState } = useConfig(programID, metaBuffer);
  const payloadSend = useMessage(programID);

  console.log('round: ', roundState)

  const { state } = gameState;
  const { minutes, hours, seconds } = useMsToTime(timeLeft.state?.Deadline);

  const round = (Number(roundState.state?.CurrentRound) + 1).toString();

  const gameStage: any = useMemo(() => gameStageState.state?.GameStage, [gameStageState.state?.GameStage]);

  const getGameStage = useMemo(
    () => {
      if (!gameStage) {
        return ''
      }
      if (gameStage === 'preparation') {
        return 'preparation';
      }
      if (Object.keys(gameStage).includes('InProgress')) {
        return 'progress';
      }
      if (Object.keys(gameStage).includes('Reveal')) {
        return 'reveal';
      }
    },
    [gameStage],
  );

  const gameStageFinishedPlayers = useMemo(() => {
    if (gameStage?.InProgress?.finishedPlayers) { return gameStage?.InProgress?.finishedPlayers }
    if (gameStage?.Reveal?.finishedPlayers) { return gameStage?.Reveal?.finishedPlayers }
  }, [gameStage?.InProgress?.finishedPlayers, gameStage?.Reveal?.finishedPlayers]);

  const { betSize, moveTimeoutMs, revealTimeoutMs, entryTimeoutMs, playersCountLimit } = state?.Config || {};

  const lobbyList = lobbyState.state?.LobbyList;

  useEffect(() => {
    if (lobbyList && Object.keys(gameStage).includes('Reveal')) setPrevLobbyList([...lobbyList as []])
  }, [lobbyList, gameStage])

  const loosers = useMemo(() => {
    const loosersArray = [] as Hex[];
    prevLobbyList.forEach((prevLobbyPlayer) => {
      if (!(lobbyList?.includes(prevLobbyPlayer as never)) && (prevLobbyPlayer !== winnerState.state?.Winner))
        loosersArray.push(prevLobbyPlayer)
    });
    return loosersArray;
  }, [lobbyList, prevLobbyList, winnerState.state?.Winner])

  useEffect(() => {
    if (gameState.error && loading) {
      setLoading(false)
      onClickRouteChange('join');
    }
    if (Number(betSize?.split(',').join('')) > 500) {
      setLoading(false)
    }
  }, [gameState.error, onClickRouteChange, loading, betSize]);

  const onClickCreate = (hex: Hex) => {
    onClickRouteChange('lobby admin')
    setProgramID(hex);
  };

  const onClickJoin = (hex: Hex,) => {
    setLoading(true);
    onClickRouteChange('Join game');
    setProgramID(hex);
  };


  const onClickRegister = () => {
    if (lobbyList?.includes(accountHex as never)) { return onClickRouteChange('game') }
    payloadSend(
      { Register: null },
      { onSuccess: () => { onClickRouteChange('game') }, value: betSize?.replace(',', '') })
  };

  const onSubmitMove = (userMove: any, pass: string) => {
    setLoading(true)
    const outputPass = userMove.id + pass;
    const payload = blake2AsHex(outputPass, 256);
    payloadSend(
      { MakeMove: payload },
      { onSuccess: () => { onClickRouteChange('game'); setMove(userMove) } })
    setLoading(false)
  };

  const onSubmitReveal = (userMove: string, pass: string) => {
    setLoading(true)

    const outputPass = stringToU8a(`${userMove}${pass}`);
    payloadSend(
      { Reveal: Array.from(outputPass) },
      { onSuccess: () => { onClickRouteChange('round result') } })
    setLoading(false)
  };

  // const onEndGame = () => {
  //   payloadSend(
  //     { StopGame: null },
  //     { onSuccess: () => { console.log('Game OvEr'); onClickRouteChange('') } })
  // };


  const getResult = () => {
    if (lobbyList?.length) {
      return (
        <RoundResult
          name=''
          game={programID}
          round={round}
          winners={Object.entries(playerMoves?.state?.PlayerMoves || [])}
          loosers={loosers}
        />
      )
    }
    return (
      <GameResult name='' game={programID} winner={winnerState.state?.Winner} loosers={loosers} />
    )
  }


  return (
    loading ? (
      <ApiLoader />
    ) : (
      <>
        {!form && <Start onCreateClick={onClickRouteChange} setProgramID={setProgramID} />}

        {form === 'create' &&
          <Create setLoading={setLoading} onBackClick={onClickRouteChange} onSubmit={create} setStateAction={onClickCreate} />
        }

        {form === 'join' &&
          <Join onBackClick={onClickRouteChange} onClickSubmit={onClickJoin} />
        }

        {form === 'lobby admin' &&
          <Game
            players={lobbyList}
            finishedPlayers={gameStageFinishedPlayers}
            onRouteChange={onClickRouteChange}
            heading={'heading' || programID}
            stage={getGameStage}
            bet={betSize}
            game='current game'
            round={round}
            hoursLeft={hours}
            minutesLeft={minutes}
            secondsLeft={seconds}
            admin
          />
        }
        {form === 'detail' &&
          <Details
            heading={'heading' || programID}
            game='current game'
            round={round}
            bet={betSize}
            players={lobbyList}
            contract={programID}
            move={moveTimeoutMs}
            reveal={revealTimeoutMs}
            entry={entryTimeoutMs}
            SVG={GearBgSVG}
            onBackClick={onClickRouteChange}
          />}
        {form === 'detail admin' &&
          <Details
            heading={'heading' || programID}
            game='current game'
            round={round}
            bet={betSize}
            players={lobbyList}
            contract={programID}
            move={moveTimeoutMs}
            reveal={revealTimeoutMs}
            entry={entryTimeoutMs}
            SVG={GearBgSVG}
            onBackClick={onClickRouteChange}
            admin
          />}
        {form === 'Join game' &&
          <JoinDetails
            clearProgrammId={setProgramID}
            onBackClick={onClickRouteChange}
            onClickRegister={onClickRegister}
            payloadSend={payloadSend}
            round={round}
            game='current game'
            heading={'heading' || programID}
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
          />
        }
        {form === 'game' &&
          <Game
            account={accountHex}
            players={lobbyList}
            finishedPlayers={gameStageFinishedPlayers}
            onRouteChange={onClickRouteChange}
            heading='somth heading'
            stage={getGameStage}
            bet={betSize}
            game='current game'
            round={round}
            hoursLeft={hours}
            minutesLeft={minutes}
            secondsLeft={seconds}
          />
        }

        {form === 'move' && <Move onSubmitMove={onSubmitMove} onRouteChange={onClickRouteChange} />}

        {form === 'reveal' && <Reveal move={move} onClickMove={onSubmitReveal} onRouteChange={onClickRouteChange} />}

        {form === 'round result' &&
          (gameStage?.Reveal ?
            <Game
              account={accountHex}
              players={lobbyList}
              finishedPlayers={gameStageFinishedPlayers}
              onRouteChange={onClickRouteChange}
              heading='somth heading'
              stage={getGameStage}
              bet={betSize}
              game='current game'
              round={round}
              hoursLeft={hours}
              minutesLeft={minutes}
              secondsLeft={seconds}
            /> : (
              getResult()
            ))
        }
      </>)
  )
}

export { Home };
