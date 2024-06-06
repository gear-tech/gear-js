import { Sails } from 'sails-js';

import { getPreformattedText } from '@/shared/helpers';

import { RESULT } from '../consts';
import {
  EnumDef,
  FixedSizeArrayDef,
  ISailsFuncArg,
  MapDef,
  ResultDef,
  StructDef,
  TypeDef,
  UserDefinedDef,
  PayloadValue,
  VecDef,
} from '../types';

const initGetDefaultValue = (sails: Sails) => {
  const getResultValue = ({ [RESULT.OK]: { def } }: ResultDef) => ({ [RESULT.OK]: getValue(def) });
  const getVecValue = ({ def }: VecDef) => getPreformattedText([getValue(def)]);
  const getFixedSizeArrayValue = ({ len, def }: FixedSizeArrayDef) => new Array<PayloadValue>(len).fill(getValue(def));
  const getMapValue = ({ key, value }: MapDef) => getPreformattedText([[getValue(key.def), getValue(value.def)]]);
  const getUserDefinedValue = ({ name }: UserDefinedDef) => getValue(sails.getTypeDef(name));
  const getEnumValue = ({ variants: [{ def, name }] }: EnumDef) => ({ [name]: def ? getValue(def) : null });

  const getStructValue = ({ isTuple, fields }: StructDef) => {
    // not sure about tuple
    console.log(isTuple);
    if (isTuple) return `[${fields.map((field) => getValue(field.def)).join(', ')}]`;

    const result = fields.map(({ name, def }) => [name, getValue(def)] as const);

    return Object.fromEntries(result);
  };

  const getValue = (def: TypeDef): PayloadValue => {
    if (def.isPrimitive) return '';
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
  const getDefaultValue = initGetDefaultValue(sails);
  const result = args.map(({ typeDef }, index) => [index, getDefaultValue(typeDef)] as const);

  return Object.fromEntries(result);
};

export { getDefaultPayloadValue };
