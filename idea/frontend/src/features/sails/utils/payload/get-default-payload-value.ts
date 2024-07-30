import {
  EnumDef,
  FixedSizeArrayDef,
  MapDef,
  PrimitiveDef,
  ResultDef,
  Sails,
  StructDef,
  TypeDef,
  UserDefinedDef,
  VecDef,
} from 'sails-js';

import { getPreformattedText } from '@/shared/helpers';

import { RESULT } from '../../consts';
import { PayloadValue, ISailsFuncArg } from '../../types';

const getDefaultValue = (sails: Sails) => {
  const getPrimitiveValue = (def: PrimitiveDef) => (def.isBool ? false : '');
  const getResultValue = ({ [RESULT.OK]: { def } }: ResultDef) => ({ [RESULT.OK]: getValue(def) });
  const getVecValue = ({ def }: VecDef) => getPreformattedText([getValue(def)]);
  const getFixedSizeArrayValue = ({ len, def }: FixedSizeArrayDef) => new Array<PayloadValue>(len).fill(getValue(def));
  const getMapValue = ({ key, value }: MapDef) => getPreformattedText([[getValue(key.def), getValue(value.def)]]);
  const getUserDefinedValue = ({ name }: UserDefinedDef) => getValue(sails.getTypeDef(name));
  const getEnumValue = ({ variants: [{ def, name }] }: EnumDef) => ({ [name]: def ? getValue(def) : null });

  const getStructValue = ({ fields }: StructDef) => {
    const result = fields.map(({ name, def }, index) => [name || index, getValue(def)] as const);

    return Object.fromEntries(result);
  };

  const getValue = (def: TypeDef): PayloadValue => {
    if (def.isPrimitive) return getPrimitiveValue(def.asPrimitive);
    if (def.isOptional) return null;
    if (def.isResult) return getResultValue(def.asResult);
    if (def.isVec) return getVecValue(def.asVec);
    if (def.isFixedSizeArray) return getFixedSizeArrayValue(def.asFixedSizeArray);
    if (def.isMap) return getMapValue(def.asMap);
    if (def.isUserDefined) return getUserDefinedValue(def.asUserDefined);
    if (def.isStruct) return getStructValue(def.asStruct);
    if (def.isEnum) return getEnumValue(def.asEnum);

    throw new Error('Unknown type: ' + JSON.stringify(def));
  };

  return getValue;
};

const getDefaultPayloadValue = (sails: Sails, args: ISailsFuncArg[]) => {
  const result = args.map(({ typeDef }, index) => [index, getDefaultValue(sails)(typeDef)] as const);

  return Object.fromEntries(result);
};

export { getDefaultValue, getDefaultPayloadValue };
