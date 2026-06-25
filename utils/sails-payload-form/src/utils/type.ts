import type { Type, TypeDecl } from 'sails-js/types';

import { isFixedSizeArray, isPrimitive, isSlice, isTuple } from './type-decl';

const getPrimitiveType = (decl: TypeDecl) => {
  if (decl === '()') return 'Null';
  if (typeof decl !== 'string') throw new Error('Expected primitive type');

  return decl;
};

const getType = (decl: TypeDecl, resolvedType?: Type): string => {
  if (isPrimitive(decl)) return getPrimitiveType(decl);

  if (isSlice(decl)) return `Vec<${getType(decl.item)}>`;

  if (isFixedSizeArray(decl)) return `[${getType(decl.item)}; ${decl.len}]`;

  if (isTuple(decl)) return `(${decl.types.map((type) => getType(type)).join(', ')})`;

  if (decl.kind === 'named') {
    if (decl.name === 'Option') return `Option<${getType(decl.generics![0])}>`;
    if (decl.name === 'Result') return `Result<${getType(decl.generics![0])}, ${getType(decl.generics![1])}>`;
    if (decl.name === 'BTreeMap') return `BTreeMap<${getType(decl.generics![0])}, ${getType(decl.generics![1])}>`;

    if (decl.generics?.length) return `${decl.name}<${decl.generics.map((g) => getType(g)).join(', ')}>`;

    return decl.name;
  }

  if (resolvedType?.kind === 'struct') {
    const result = resolvedType.fields.map((field) => [field.name || '', getType(field.type)]);

    return JSON.stringify(Object.fromEntries(result));
  }

  if (resolvedType?.kind === 'enum') {
    const result = resolvedType.variants.map((variant) => {
      if (!variant.fields.length) return [variant.name, 'Null'] as const;

      if (variant.fields.length === 1) return [variant.name, getType(variant.fields[0].type)] as const;

      const fields = variant.fields.map((field) => [field.name || '', getType(field.type)]);

      return [variant.name, JSON.stringify(Object.fromEntries(fields))] as const;
    });

    return JSON.stringify({ _enum: Object.fromEntries(result) });
  }

  throw new Error(`Unknown type: ${JSON.stringify(decl)}`);
};

export { getType };
