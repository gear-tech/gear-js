import { HexString } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { Sails } from 'sails-js';
import { ISailsTypeDef } from 'sails-js-types';
import { z } from 'zod';

import { RESULT } from '../../consts';
import { ISailsFuncArg } from '../../types';

const asJSON = <T extends z.ZodTypeAny>(schema: T) =>
  schema.transform((value, ctx) => {
    try {
      return JSON.parse(value) as AnyJson;
    } catch (e) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
      return z.NEVER;
    }
  });

// cuz we need to cast to tuple schemas array that was mapped
const asTuple = <T extends z.ZodTypeAny>(schema: T[]) => z.tuple(schema as [T, ...T[]]);

const isUnion = <T>(arr: T[]): arr is [T, T, ...T[]] => arr.length >= 2;

const getPayloadSchema = (sails: Sails, args: ISailsFuncArg[], encode: (..._args: unknown[]) => HexString) => {
  const getSchema = (def: ISailsTypeDef): z.ZodType<unknown> => {
    if (def.isPrimitive) return def.asPrimitive.isBool ? z.boolean() : z.string().trim();

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
      const { isTuple, fields } = def.asStruct;

      if (isTuple) return asTuple(fields.map((field) => getSchema(field.def)));

      const fieldsSchema = fields.map((field, index) => [field.name || index, getSchema(field.def)] as const);

      return z.object(Object.fromEntries(fieldsSchema));
    }

    if (def.isEnum) {
      const variants = def.asEnum.variants.map((variant) =>
        z.object({ [variant.name]: variant.def ? getSchema(variant.def) : z.null() } as const),
      );

      return isUnion(variants) ? z.union(variants) : variants[0] || z.null();
    }

    throw new Error('Unknown type: ' + JSON.stringify(def));
  };

  const result = args.map(({ typeDef }, index) => [index, getSchema(typeDef)] as const);

  return z.object(Object.fromEntries(result)).transform((value) => encode(...Object.values(value)));
};

export { getPayloadSchema };
