import { Hex } from '@gear-js/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { LOCAL_STORAGE } from 'consts';
import { GameStageType, StageType } from 'types';
import { isExists, isMinValue, useForm } from './form';
import { onSubmitReveal, onSubmitMove, onClickRegister } from './sendMessage';

const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;

const handleRouteChange = (admin: boolean | undefined, routeChange: (arg: string) => void) => {
  if (admin) {
    routeChange('lobby admin');
  } else {
    routeChange('game');
  }
};

const gameStageFinishedPlayers = (gameStage: GameStageType) => {
  let finishedPlayers: Hex[] = [];
  if (gameStage?.InProgress?.finishedPlayers.length) finishedPlayers = gameStage?.InProgress?.finishedPlayers;
  if (gameStage?.Reveal?.finishedPlayers.length) finishedPlayers = gameStage?.Reveal?.finishedPlayers;
  return { finishedPlayers };
};

const getGameStage = (stageData: any) => {
  const gameStageKeys = typeof stageData === 'object' ? Object.keys(stageData) : [];
  let gameStage: StageType = 'preparation';
  if (gameStageKeys?.includes('InProgress')) {
    gameStage = 'progress';
  } else if (gameStageKeys?.includes('Reveal')) {
    gameStage = 'reveal';
  } else {
    gameStage = 'preparation';
  }
  return { gameStage };
};

const getLoosers  = (prevLobbyList:Hex[], lobbyList:Hex[]|undefined, winnerState:any ) => {
  const loosers = [] as Hex[];
  prevLobbyList.forEach((prevLobbyPlayer) => {
    if (!lobbyList?.includes(prevLobbyPlayer as never) && prevLobbyPlayer !== winnerState.state?.Winner){
      loosers.push(prevLobbyPlayer)}
  });
  return { loosers };
};

export {
  isLoggedIn,
  isExists,
  isMinValue,
  useForm,
  onSubmitReveal,
  onSubmitMove,
  onClickRegister,
  handleRouteChange,
  gameStageFinishedPlayers,
  getGameStage,
  getLoosers,
};
