import type { SailsProgram } from 'sails-js';
import type { ITypeDeclNamed, Type, TypeDecl } from 'sails-js/types';

type NamedTypeDecl = Extract<TypeDecl, { kind: 'named' }>;

const isNamed = (decl: TypeDecl): decl is NamedTypeDecl => typeof decl === 'object' && decl.kind === 'named';

const isPrimitive = (decl: TypeDecl): decl is Extract<TypeDecl, string> => typeof decl === 'string';

const isBool = (decl: TypeDecl) => decl === 'bool';

const isOption = (decl: TypeDecl): decl is NamedTypeDecl & { name: 'Option' } =>
  isNamed(decl) && decl.name === 'Option' && Boolean(decl.generics?.length);

const isResult = (decl: TypeDecl): decl is NamedTypeDecl & { name: 'Result' } =>
  isNamed(decl) && decl.name === 'Result' && (decl.generics?.length ?? 0) >= 2;

const isBTreeMap = (decl: TypeDecl): decl is NamedTypeDecl & { name: 'BTreeMap' } =>
  isNamed(decl) && decl.name === 'BTreeMap' && (decl.generics?.length ?? 0) >= 2;

const isSlice = (decl: TypeDecl): decl is Extract<TypeDecl, { kind: 'slice' }> =>
  typeof decl === 'object' && decl.kind === 'slice';

const isFixedSizeArray = (decl: TypeDecl): decl is Extract<TypeDecl, { kind: 'array' }> =>
  typeof decl === 'object' && decl.kind === 'array';

const isTuple = (decl: TypeDecl): decl is Extract<TypeDecl, { kind: 'tuple' }> =>
  typeof decl === 'object' && decl.kind === 'tuple';

const isUserDefined = (decl: TypeDecl): decl is ITypeDeclNamed =>
  isNamed(decl) &&
  ![
    'Option',
    'Result',
    'BTreeMap',
    'NonZeroU8',
    'NonZeroU16',
    'NonZeroU32',
    'NonZeroU64',
    'NonZeroU128',
    'NonZeroU256',
  ].includes(decl.name);

const resolveNamedType = (
  program: SailsProgram,
  serviceName: string | undefined,
  decl: NamedTypeDecl,
): Type | undefined => {
  if (serviceName) return program.resolveInService(serviceName, decl);

  return program.typeResolver.resolveNamed(decl);
};

export {
  isBool,
  isBTreeMap,
  isFixedSizeArray,
  isNamed,
  isOption,
  isPrimitive,
  isResult,
  isSlice,
  isTuple,
  isUserDefined,
  resolveNamedType,
};
