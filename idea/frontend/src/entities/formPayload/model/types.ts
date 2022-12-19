import { ProgramMetadata } from '@gear-js/api';

import { ValueType } from './consts';

type TypeStructure = {
  name: string;
  type: ValueType;
  count?: number;
  value:
    | string
    | TypeStructure[]
    | {
        [key: string]: TypeStructure;
      };
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
  deposit: number;
  metadata?: ProgramMetadata;
  maxGasLimit: number;
};

export type { TypeStructure, PayloadValue, PayloadSchemaModel, PayloadSchemaParams };
