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

const useRockPaperScissors = (programID: Hex, metaBuffer: any) => {

    const payloadConfig = useMemo(() => ({ Config: null }), []);
    const payloadGameStage = useMemo(() => ({ GameStage: null }), []);
    const payloadLobby = useMemo(() => ({ LobbyList: null }), []);
    const payloadTime = useMemo(() => ({ Deadline: null }), []);
    const payloadPlayerMoves = useMemo(() => ({ PlayerMoves: null }), []);
    const payloadWinner = useMemo(() => ({ Winner: null }), []);
    const payloadRound = useMemo(() => ({ CurrentRound: null }), []);

    const gameState = useReadState<StateConfigType>(programID, metaBuffer, payloadConfig);
    const gameStageState = useReadState<StateGameStageType>(programID, metaBuffer, payloadGameStage);
    const lobbyState = useReadState<StateLobbyType>(programID, metaBuffer, payloadLobby);
    const winnerState = useReadState<StateWinnerType>(programID, metaBuffer, payloadWinner);
    const timeLeft = useReadState<StateTimeLeftType>(programID, metaBuffer, payloadTime);
    const playerMoves = useReadState<PlayersMoveType>(programID, metaBuffer, payloadPlayerMoves);
    const roundState = useReadState<StateRoundType>(programID, metaBuffer, payloadRound);

    return { gameState, gameStageState, lobbyState, timeLeft, playerMoves, winnerState, roundState }
}

export { useRockPaperScissors }