import { Sails } from 'sails-js';

// TODO: import from sails-js
type ISailsFuncArg = InstanceType<typeof Sails>['services'][string]['functions'][string]['args'][number];
type TypeDef = ReturnType<InstanceType<typeof Sails>['getTypeDef']>;

type PrimitiveDef = TypeDef['asPrimitive'];
type EnumDef = TypeDef['asEnum'];
type UserDefinedDef = TypeDef['asUserDefined'];
type StructDef = TypeDef['asStruct'];
type OptionalDef = TypeDef['asOptional'];
type ResultDef = TypeDef['asResult'];
type VecDef = TypeDef['asVec'];
type MapDef = TypeDef['asMap'];
type FixedSizeArrayDef = TypeDef['asFixedSizeArray'];

export type {
  ISailsFuncArg,
  TypeDef,
  PrimitiveDef,
  EnumDef,
  UserDefinedDef,
  StructDef,
  OptionalDef,
  ResultDef,
  VecDef,
  MapDef,
  FixedSizeArrayDef,
};
