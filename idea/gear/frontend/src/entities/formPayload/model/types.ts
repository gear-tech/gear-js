import type { ProgramMetadata, TypeKind } from '@gear-js/api';
import type { BigNumber } from 'bignumber.js';

type TypeStructure = {
  name: string;
  kind: TypeKind;
  type: string | object | TypeStructure;
  len?: number;
};

type PayloadValue =
  | string
  | string[]
  | PayloadValue[]
  | null
  | {
      [key: string]: PayloadValue;
    };

type PayloadSchemaModel = {
  type?: string;
  deposit: number;
  metadata?: ProgramMetadata;
  maxGasLimit: number;
};

type PayloadSchemaParams = {
  type?: string;
  deposit: BigNumber;
  metadata?: ProgramMetadata;
  maxGasLimit: BigNumber;
  balanceMultiplier: BigNumber;
  decimals: number;
  gasMultiplier: BigNumber;
};

export type { PayloadSchemaModel, PayloadSchemaParams, PayloadValue, TypeStructure };
