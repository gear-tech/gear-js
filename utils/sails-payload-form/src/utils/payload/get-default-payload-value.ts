import type { Sails, SailsProgram } from 'sails-js';
import type { Type, TypeDecl } from 'sails-js/types';

import { RESULT } from '../../consts';
import type { ISailsFuncArg, PayloadValue } from '../../types';
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

import { getLegacyDefaultPayloadValue } from './legacy-get-default-payload-value';

const getPreformattedText = (data: unknown) => JSON.stringify(data, null, 4);

const getResolvedValue = (program: SailsProgram, serviceName: string | undefined, resolvedType: Type): PayloadValue => {
  if (resolvedType.kind === 'alias') return getValue(program, serviceName, resolvedType.target);

  if (resolvedType.kind === 'struct') {
    if (!resolvedType.fields.length) return {};

    const result = resolvedType.fields.map(
      ({ name, type }, index) => [name || index, getValue(program, serviceName, type)] as const,
    );

    return Object.fromEntries(result);
  }

  if (resolvedType.kind === 'enum') {
    const [{ name, fields }] = resolvedType.variants;

    if (!fields.length) return { [name]: null };

    if (fields.length === 1) return { [name]: getValue(program, serviceName, fields[0].type) };

    const variantFields = fields.map(
      ({ name: fieldName, type }, index) => [fieldName || index, getValue(program, serviceName, type)] as const,
    );

    return { [name]: Object.fromEntries(variantFields) };
  }

  throw new Error(`Unknown resolved type: ${JSON.stringify(resolvedType)}`);
};

const getValue = (program: SailsProgram, serviceName: string | undefined, def: TypeDecl): PayloadValue => {
  if (isPrimitive(def)) return def === 'bool' ? false : '';

  if (isOption(def)) return null;

  if (isResult(def)) return { [RESULT.OK]: getValue(program, serviceName, def.generics![0]) };

  if (isSlice(def)) return getPreformattedText([getValue(program, serviceName, def.item)]);

  if (isFixedSizeArray(def)) return new Array<PayloadValue>(def.len).fill(getValue(program, serviceName, def.item));

  if (isTuple(def)) return def.types.map((type) => getValue(program, serviceName, type));

  if (isBTreeMap(def)) {
    const [key, value] = def.generics!;

    return getPreformattedText([[getValue(program, serviceName, key), getValue(program, serviceName, value)]]);
  }

  if (isUserDefined(def)) {
    const resolved = resolveNamedType(program, serviceName, def);

    if (resolved) return getResolvedValue(program, serviceName, resolved);
  }

  throw new Error(`Unknown type: ${JSON.stringify(def)}`);
};

const getDefaultValue =
  (program: SailsProgram, serviceName?: string) =>
  (def: TypeDecl): PayloadValue =>
    getValue(program, serviceName, def);

const getDefaultPayloadValueV2 = (program: SailsProgram, args: ISailsFuncArg[], serviceName?: string) => {
  const result = args.map(
    ({ typeDef }, index) => [index, getValue(program, serviceName, typeDef as TypeDecl)] as const,
  );

  return Object.fromEntries(result);
};

function getDefaultPayloadValue(
  program: SailsProgram,
  args: ISailsFuncArg[],
  serviceName?: string,
): ReturnType<typeof getDefaultPayloadValueV2>;
function getDefaultPayloadValue(sails: Sails, args: ISailsFuncArg[]): ReturnType<typeof getLegacyDefaultPayloadValue>;
function getDefaultPayloadValue(
  programOrSails: Sails | SailsProgram,
  args: ISailsFuncArg[],
  serviceName?: string,
): ReturnType<typeof getDefaultPayloadValueV2> | ReturnType<typeof getLegacyDefaultPayloadValue>;
function getDefaultPayloadValue(programOrSails: Sails | SailsProgram, args: ISailsFuncArg[], serviceName?: string) {
  if (isIdlV2Program(programOrSails)) {
    return getDefaultPayloadValueV2(
      programOrSails,
      args as Parameters<typeof getDefaultPayloadValueV2>[1],
      serviceName,
    );
  }

  return getLegacyDefaultPayloadValue(programOrSails, args as Parameters<typeof getLegacyDefaultPayloadValue>[1]);
}

export { getDefaultPayloadValue, getDefaultValue };
