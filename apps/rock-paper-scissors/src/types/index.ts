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

type StateRoundType = { CurrentRound: number | string };

type StateWinnerType = { Winner: Hex };

type TimeType = { hours: string; minutes: string; seconds: string };

type PlayersMoveType = { PlayerMoves: Hex[] };

type UserMoveType = { name: string; id: string; SVG: React.FunctionComponent<React.SVGProps<SVGSVGElement>> };

type GameStageType = {
  InProgress: { finishedPlayers: Hex[] };
  Reveal: { finishedPlayers: Hex[] };
};

type AnyJson =
  | string
  | number
  | boolean
  | AnyJson[]
  | {
      [index: string]: AnyJson;
    }
  | null
  | undefined;

type SendMessageOptions = {
  value?: string | number;
  isOtherPanicsAllowed?: boolean;
  onSuccess?: () => void;
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
  AnyJson,
  SendMessageOptions,
};
