import { Hex } from '@gear-js/api';
import { FunctionComponent, SVGProps } from 'react';

type StageType = 'preparation' | 'progress' | 'reveal';

type SVGType = FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;

type StateConfigType = {
  Config: {
    betSize: string;
    entryTimeoutMs: string;
    moveTimeoutMs: string;
    playersCountLimit: string;
    revealTimeoutMs: string;
  };
};

type StateTimeLeftType = { Deadline: string };

type StateGameStageType = { GameStage: StageType | {} };

type StateLobbyType = { LobbyList: Hex[] };

type StateRoundType = { CurrentRound: number | string | undefined };

type StateWinnerType = { Winner: Hex | undefined };

type TimeType = { hours: string; minutes: string; seconds: string };

type PlayersMoveType = { PlayerMoves: Hex[] };

type UserMoveType = { name: string; id: string; SVG: React.FunctionComponent<React.SVGProps<SVGSVGElement>> };

type GameStageType = {
  InProgress: { finishedPlayers: Hex[] };
  Reveal: { finishedPlayers: Hex[] };
};

export type {
  StageType,
  SVGType,
  StateConfigType,
  StateGameStageType,
  StateLobbyType,
  StateTimeLeftType,
  TimeType,
  PlayersMoveType,
  UserMoveType,
  StateRoundType,
  StateWinnerType,
  GameStageType,
};
