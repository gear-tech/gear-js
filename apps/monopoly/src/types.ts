import { Hex } from '@gear-js/api';

type PlayerState = {
  balance: string;
  cells: [];
  inJail: false;
  penalty: string;
  position: string;
  round: string;
  lost: boolean;
};

type Players = {
  [key: Hex]: PlayerState;
};

type State = {
  admin: Hex;
  currentTurn: string;
  currentStep: string;
  gameStatus: string;
  numberOfPlayers: string;
  ownership: {};
  players: Players | null;
  playersQueue: [];
  properties: {};
  propertiesInBank: [];
  round: string;
  winner: Hex;
};

type PlayerType = {
  color: 'pink' | 'purple' | 'green' | 'yellow';
  address: string;
  balance: string;
};

type Properties = { [key: number]: [['Platinum' | 'Silver' | 'Gold'], string, string] };

type Step = {
  currentStep: string;
  currentPlayer: Hex;
  players: Players;
  properties: Properties;
  ownership: { [key: number]: Hex };
};

type MessagePayload = { GameFinished: { winner: Hex } } | { Step: Step } | string;

type CellValues = {
  heading: string;
  baseRent: number;
  bronze: number;
  silver: number;
  gold: number;
  cell: number;
  deposit: number;
  buyout: number;
  branch: number;
};

export type { PlayerState, PlayerType, State, Step, MessagePayload, Players, Properties, CellValues };
