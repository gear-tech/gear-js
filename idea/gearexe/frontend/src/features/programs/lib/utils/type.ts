import { ISailsPrimitiveDef, ISailsTypeDef } from 'sails-js-types';

const getPrimitiveType = (def: ISailsPrimitiveDef) => {
  if (def.isNull) return 'Null';
  if (def.isBool) return 'Bool';
  if (def.isChar) return 'Char';
  if (def.isStr) return 'Str';
  if (def.isU8) return 'U8';
  if (def.isU16) return 'U16';
  if (def.isU32) return 'U32';
  if (def.isU64) return 'U64';
  if (def.isU128) return 'U128';
  if (def.isI8) return 'I8';
  if (def.isI16) return 'I16';
  if (def.isI32) return 'I32';
  if (def.isI64) return 'I64';
  if (def.isI128) return 'I128';
  if (def.isActorId) return 'ActorId';
  if (def.isCodeId) return 'CodeId';
  if (def.isMessageId) return 'MessageId';
  if (def.isH256) return 'H256';
  if (def.isU256) return 'U256';
  if (def.isH160) return 'H160';
  if (def.isNonZeroU8) return 'NonZeroU8';
  if (def.isNonZeroU16) return 'NonZeroU16';
  if (def.isNonZeroU32) return 'NonZeroU32';
  if (def.isNonZeroU64) return 'NonZeroU64';
  if (def.isNonZeroU128) return 'NonZeroU128';
  if (def.isNonZeroU256) return 'NonZeroU256';

  throw new Error('Unknown primitive type');
};

const getType = (def: ISailsTypeDef): string => {
  if (def.isPrimitive) return getPrimitiveType(def.asPrimitive);
  if (def.isOptional) return `Option<${getType(def.asOptional.def)}>`;
  if (def.isResult) return `Result<${getType(def.asResult.ok.def)}, ${getType(def.asResult.err.def)}>`;
  if (def.isVec) return `Vec<${getType(def.asVec.def)}>`;
  if (def.isFixedSizeArray) return `[${getType(def.asFixedSizeArray.def)}; ${def.asFixedSizeArray.len}]`;
  if (def.isMap) return `BTreeMap<${getType(def.asMap.key.def)}, ${getType(def.asMap.value.def)}>`;
  if (def.isUserDefined) return def.asUserDefined.name;

  if (def.isStruct) {
    if (def.asStruct.isTuple) return `(${def.asStruct.fields.map((field) => getType(field.def)).join(', ')})`;

    const result = def.asStruct.fields.map((field) => [field.name, getType(field.def)]);

    return JSON.stringify(Object.fromEntries(result));
  }

  if (def.isEnum) {
    if (!def.asEnum.isNesting) return JSON.stringify({ _enum: def.asEnum.variants.map((v) => v.name) });

    const result = def.asEnum.variants.map((variant) => [variant.name, variant.def ? getType(variant.def) : 'Null']);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
    return JSON.stringify({ _enum: Object.fromEntries(result) });
  }

  throw new Error('Unknown type: ' + JSON.stringify(def));
};

export { getType };
