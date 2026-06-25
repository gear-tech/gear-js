import type { AnyJson } from '@polkadot/types/types';
import type { Sails, SailsProgram } from 'sails-js';
import type { Type, TypeDecl } from 'sails-js/types';
import { z } from 'zod';

import { RESULT } from '../../consts';
import type { HexString, ISailsFuncArg } from '../../types';
import { isIdlV2Program } from '../program';
import {
  isBTreeMap,
  isFixedSizeArray,
  isOption,
  isPrimitive,
  isResult,
  isSlice,
  isTuple,
  isUserDefined,
  resolveNamedType,
} from '../type-decl';

import { getLegacyPayloadSchema } from './legacy-get-payload-schema';

const asJSON = <T extends z.ZodType<string>>(schema: T) =>
  schema.transform((value, ctx) => {
    try {
      return JSON.parse(value) as AnyJson;
    } catch (_) {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
      return z.NEVER;
    }
  });

const asTuple = <T extends z.ZodTypeAny>(schema: T[]) => z.tuple(schema as [T, ...T[]]);

const isUnion = <T>(arr: T[]): arr is [T, T, ...T[]] => arr.length >= 2;

const getResolvedSchema = (
  program: SailsProgram,
  serviceName: string | undefined,
  resolvedType: Type,
): z.ZodType<unknown> => {
  if (resolvedType.kind === 'alias') return getSchema(program, serviceName, resolvedType.target);

  if (resolvedType.kind === 'struct') {
    if (!resolvedType.fields.length) return z.object({});

    const fieldsSchema = resolvedType.fields.map(
      (field, index) => [field.name || index, getSchema(program, serviceName, field.type)] as const,
    );

    return z.object(Object.fromEntries(fieldsSchema));
  }

  if (resolvedType.kind === 'enum') {
    const variants = resolvedType.variants.map((variant) => {
      if (!variant.fields.length) return z.object({ [variant.name]: z.null() } as const);

      if (variant.fields.length === 1)
        return z.object({ [variant.name]: getSchema(program, serviceName, variant.fields[0].type) } as const);

      const fieldsSchema = variant.fields.map(
        (field, index) => [field.name || index, getSchema(program, serviceName, field.type)] as const,
      );

      return z.object({ [variant.name]: z.object(Object.fromEntries(fieldsSchema)) } as const);
    });

    return isUnion(variants) ? z.union(variants) : variants[0] || z.null();
  }

  throw new Error(`Unknown resolved type: ${JSON.stringify(resolvedType)}`);
};

const getSchema = (program: SailsProgram, serviceName: string | undefined, def: TypeDecl): z.ZodType<unknown> => {
  if (isPrimitive(def)) return def === 'bool' ? z.boolean() : z.string().trim();

  if (isOption(def)) return z.union([z.null(), getSchema(program, serviceName, def.generics![0])]);

  if (isResult(def))
    return z.union([
      z.object({ [RESULT.OK]: getSchema(program, serviceName, def.generics![0]) }),
      z.object({ [RESULT.ERR]: getSchema(program, serviceName, def.generics![1]) }),
    ]);

  if (isSlice(def)) return asJSON(z.string().trim());

  if (isFixedSizeArray(def)) return z.array(getSchema(program, serviceName, def.item)).length(def.len);

  if (isTuple(def)) return asTuple(def.types.map((type) => getSchema(program, serviceName, type)));

  if (isBTreeMap(def)) return asJSON(z.string().trim());

  if (isUserDefined(def)) {
    const resolved = resolveNamedType(program, serviceName, def);

    if (resolved) return getResolvedSchema(program, serviceName, resolved);
  }

  throw new Error(`Unknown type: ${JSON.stringify(def)}`);
};

const getPayloadSchemaV2 = (
  program: SailsProgram,
  serviceName: string | undefined,
  args: ISailsFuncArg[],
  encode: (..._args: unknown[]) => HexString,
) => {
  const result = args.map(
    ({ typeDef }, index) => [index, getSchema(program, serviceName, typeDef as TypeDecl)] as const,
  );

  return z.object(Object.fromEntries(result)).transform((decoded) => ({
    decoded,
    encoded: encode(...Object.values(decoded)),
  }));
};

function getPayloadSchema(
  program: SailsProgram,
  serviceName: string | undefined,
  args: ISailsFuncArg[],
  encode: (..._args: unknown[]) => HexString,
): ReturnType<typeof getPayloadSchemaV2>;
function getPayloadSchema(
  sails: Sails,
  args: ISailsFuncArg[],
  encode: (..._args: unknown[]) => HexString,
): ReturnType<typeof getLegacyPayloadSchema>;
function getPayloadSchema(
  programOrSails: Sails | SailsProgram,
  serviceName: string | undefined,
  args: ISailsFuncArg[],
  encode: (..._args: unknown[]) => HexString,
): ReturnType<typeof getPayloadSchemaV2> | ReturnType<typeof getLegacyPayloadSchema>;
function getPayloadSchema(
  programOrSails: Sails | SailsProgram,
  serviceNameOrArgs: string | undefined | ISailsFuncArg[],
  argsOrEncode?: ISailsFuncArg[] | ((..._args: unknown[]) => HexString),
  encode?: (..._args: unknown[]) => HexString,
) {
  if (isIdlV2Program(programOrSails)) {
    return getPayloadSchemaV2(
      programOrSails,
      serviceNameOrArgs as string | undefined,
      argsOrEncode as ISailsFuncArg[],
      encode!,
    );
  }

  const args = Array.isArray(serviceNameOrArgs) ? serviceNameOrArgs : (argsOrEncode as ISailsFuncArg[]);
  const encodeFn = Array.isArray(serviceNameOrArgs) ? (argsOrEncode as typeof encode)! : encode!;

  return getLegacyPayloadSchema(programOrSails, args as Parameters<typeof getLegacyPayloadSchema>[1], encodeFn);
}

export { getPayloadSchema };
