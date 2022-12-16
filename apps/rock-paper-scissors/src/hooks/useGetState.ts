import { useMemo } from 'react';
import { Hex } from "@gear-js/api";
import { useReadState } from '@gear-js/react-hooks';
import {
    StateConfigType,
    StateGameStageType,
    StateLobbyType,
    StateTimeLeftType,
    PlayersMoveType,
    StateRoundType,
    StateWinnerType
} from 'types';

export const useGetState = (programID: Hex, metaBuffer: any) => {

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