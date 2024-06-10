import { Sails } from 'sails-js';
import { z } from 'zod';

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

const getDefaultValue = (sails: Sails) => {
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
  const result = args.map(({ typeDef }, index) => [index, getDefaultValue(sails)(typeDef)] as const);

  return Object.fromEntries(result);
};

const asJSON = <T extends z.ZodTypeAny>(schema: T) =>
  schema.transform((value, ctx) => {
    try {
      return JSON.parse(value) as PayloadValue[];
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
      return z.NEVER;
    }
  });

const getPayloadSchema = (sails: Sails, args: ISailsFuncArg[]) => {
  // TODO: types
  const getSchema = (def: TypeDef): z.ZodType<unknown> => {
    if (def.isPrimitive) return z.string().trim();

    if (def.isOptional) return z.union([z.null(), getSchema(def.asOptional.def)]);

    if (def.isResult)
      return z.union([
        z.object({ [RESULT.OK]: getSchema(def.asResult[RESULT.OK].def) }),
        z.object({ [RESULT.ERR]: getSchema(def.asResult[RESULT.ERR].def) }),
      ]);

    if (def.isVec) return asJSON(z.string().trim());

    if (def.isFixedSizeArray) return z.array(getSchema(def.asFixedSizeArray.def)).length(def.asFixedSizeArray.len);

    if (def.isMap) return asJSON(z.string().trim());

    if (def.isUserDefined) return getSchema(sails.getTypeDef(def.asUserDefined.name));

    if (def.isStruct) {
      const fieldsSchema = def.asStruct.fields.map(
        (field, index) => [field.name || index, getSchema(field.def)] as const,
      );

      return z.object(Object.fromEntries(fieldsSchema));
    }

    if (def.isEnum) {
      const variants = def.asEnum.variants.map((variant) =>
        z.object({ [variant.name]: variant.def ? getSchema(variant.def) : z.null() } as const),
      );

      // TODO: types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return z.union(variants);
    }

    throw new Error('Unknown type: ' + JSON.stringify(def));
  };

  const result = args.map(({ typeDef }, index) => [index, getSchema(typeDef)] as const);

  return z.object(Object.fromEntries(result)).transform((value) => Object.values(value));
};

export { getDefaultValue, getDefaultPayloadValue, getPayloadSchema };
