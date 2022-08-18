export enum enumTypes {
  'Primitive',
  'Tuple',
  'Struct',
  'Enum',
  'Array',
  'Option',
  'Result',
  'Vec',
  'BTreeMap',
  'BTreeSet',
}

export type Types =
  | 'Primitive'
  | 'Null'
  | 'Tuple'
  | 'Struct'
  | 'Enum'
  | 'Array'
  | 'Option'
  | 'Result'
  | 'Vec'
  | 'BTreeMap'
  | 'BTreeSet';

export interface TypeTree {
  name: string;
  type: Types;
  value: string | object | TypeTree;
  count?: number;
}
