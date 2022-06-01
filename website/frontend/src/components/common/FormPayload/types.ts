import { ReactNode } from 'react';

export enum ValueType {
  Vec = 'Vec',
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

export type ValueTypes =
  | 'Vec'
  | 'Enum'
  | 'Tuple'
  | 'Array'
  | 'Result'
  | 'Struct'
  | 'Option'
  | 'BTreeSet'
  | 'BTreeMap'
  | 'Primitive';

export type TypeStructure = {
  name: string;
  type: ValueTypes;
  count?: number;
  value:
    | string
    | TypeStructure[]
    | {
        [key: string]: TypeStructure;
      };
};

export type FormPayloadValues =
  | string
  | string[]
  | FormPayloadValues[]
  | null
  | {
      [key: string]: FormPayloadValues;
    };

export type PayloadTypeStructures = {
  payload: TypeStructure;
  manualPayload: any;
};

export type PayloadStructureProps = {
  title?: string;
  levelName: string;
  typeStructure: TypeStructure;
};

export type PayloadItemProps = PayloadStructureProps & {
  renderNextItem: (props: PayloadStructureProps) => ReactNode;
};
