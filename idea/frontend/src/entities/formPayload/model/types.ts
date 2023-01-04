import { ProgramMetadata } from '@gear-js/api';

type TypeKind = 'primitive' | 'empty' | 'none' | 'sequence' | 'composite' | 'variant' | 'array' | 'tuple';

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
  deposit: number;
  metadata?: ProgramMetadata;
  maxGasLimit: number;
};

export type { TypeStructure, PayloadValue, PayloadSchemaModel, PayloadSchemaParams };
