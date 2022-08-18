import { ReactNode } from 'react';

export enum ValueType {
  Vec = 'Vec',
  Null = 'Null',
  Enum = 'Enum',
  Tuple = 'Tuple',
  Array = 'Array',
  Result = 'Result',
  Struct = 'Struct',
  Option = 'Option',
  BTreeSet = 'BTreeSet',
  BTreeMap = 'BTreeMap',
  Primitive = 'Primitive',
}

export type TypeStructure = {
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

export type PayloadValue =
  | string
  | string[]
  | PayloadValue[]
  | null
  | {
      [key: string]: PayloadValue;
    };

export type FormPayloadValues = {
  payload: PayloadValue;
  manualPayload: any;
  typeStructure: TypeStructure;
};

export type PayloadStructureProps = {
  title?: string;
  levelName: string;
  typeStructure: TypeStructure;
};

export type PayloadItemProps = PayloadStructureProps & {
  renderNextItem: (props: PayloadStructureProps) => ReactNode;
};
