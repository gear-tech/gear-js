import type { ParsedSails } from '@gear-js/react-hooks';
import type { SailsProgram } from 'sails-js';
import type { Type, TypeDecl } from 'sails-js/types';

const isIdlV2Program = (program: ParsedSails): program is SailsProgram => 'resolveInService' in program;

const isPrimitive = (decl: TypeDecl): decl is Extract<TypeDecl, string> => typeof decl === 'string';

const isSlice = (decl: TypeDecl): decl is Extract<TypeDecl, { kind: 'slice' }> =>
  typeof decl === 'object' && decl.kind === 'slice';

const isFixedSizeArray = (decl: TypeDecl): decl is Extract<TypeDecl, { kind: 'array' }> =>
  typeof decl === 'object' && decl.kind === 'array';

const isTuple = (decl: TypeDecl): decl is Extract<TypeDecl, { kind: 'tuple' }> =>
  typeof decl === 'object' && decl.kind === 'tuple';

const formatTypeDecl = (decl: TypeDecl): string => {
  if (isPrimitive(decl)) {
    if (decl === '()') return 'Null';

    return decl;
  }

  if (isSlice(decl)) return `Vec<${formatTypeDecl(decl.item)}>`;

  if (isFixedSizeArray(decl)) return `[${formatTypeDecl(decl.item)}; ${decl.len}]`;

  if (isTuple(decl)) return `(${decl.types.map((type) => formatTypeDecl(type)).join(', ')})`;

  if (decl.kind === 'named') {
    const generics = decl.generics ?? [];
    if (decl.name === 'Option' && generics[0]) return `Option<${formatTypeDecl(generics[0])}>`;
    if (decl.name === 'Result' && generics[0] && generics[1])
      return `Result<${formatTypeDecl(generics[0])}, ${formatTypeDecl(generics[1])}>`;
    if (decl.name === 'BTreeMap' && generics[0] && generics[1])
      return `BTreeMap<${formatTypeDecl(generics[0])}, ${formatTypeDecl(generics[1])}>`;

    if (generics.length) return `${decl.name}<${generics.map((g) => formatTypeDecl(g)).join(', ')}>`;

    return decl.name;
  }

  return String(decl);
};

const formatTypeForPreview = (type: Type): unknown => {
  if (type.kind === 'alias') return formatTypeDecl(type.target);

  if (type.kind === 'struct') {
    return Object.fromEntries(type.fields.map((field) => [field.name || '', formatTypeDecl(field.type)]));
  }

  if (type.kind === 'enum') {
    if (type.variants.every((variant) => !variant.fields.length)) {
      return { _enum: type.variants.map((variant) => variant.name) };
    }

    return {
      _enum: Object.fromEntries(
        type.variants.map((variant) => {
          if (!variant.fields.length) return [variant.name, 'Null'] as const;

          if (variant.fields.length === 1) return [variant.name, formatTypeDecl(variant.fields[0].type)] as const;

          return [
            variant.name,
            Object.fromEntries(variant.fields.map((field) => [field.name || '', formatTypeDecl(field.type)])),
          ] as const;
        }),
      ),
    };
  }

  return `Unknown type: ${JSON.stringify(type)}`;
};

const formatTypesMap = (types: ReadonlyMap<string, Type>): Record<string, unknown> =>
  Object.fromEntries([...types.entries()].map(([name, type]) => [name, formatTypeForPreview(type)]));

const formatTypeForSignature = (type: unknown): string => {
  if (typeof type === 'string') {
    if (type.startsWith('{') || type.startsWith('[')) {
      try {
        return JSON.stringify(JSON.parse(type)).replace(/"/g, '');
      } catch {
        return type;
      }
    }

    return type;
  }

  if (type == null) return 'void';

  return JSON.stringify(type).replace(/"/g, '');
};

export { formatTypeDecl, formatTypeForPreview, formatTypeForSignature, formatTypesMap, isIdlV2Program };
