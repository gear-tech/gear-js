import { Types, TypeTree } from './interfaces';

const getTree = (type: Types, name: string, value: string | object | TypeTree, count?: number): TypeTree => {
  if (type === 'Array') {
    return {
      type,
      name,
      value,
      count,
    };
  }
  return {
    type,
    name,
    value,
  };
};

export default {
  Primitive: (type: string) => {
    return getTree('Primitive', type, type);
  },
  Tuple: (name: string, type: TypeTree[]) => {
    return getTree('Tuple', name, type);
  },
  Struct: (name: string, value: TypeTree) => {
    return getTree('Struct', name, value);
  },
  Enum: (name: string, options: TypeTree[]) => {
    return getTree('Enum', name, options);
  },
  Array: (name: string, type: TypeTree, count: number) => {
    return getTree('Array', name, type, count);
  },
  Option: (name: string, some: TypeTree) => {
    return getTree('Option', name, some);
  },
  Result: (name: string, ok: TypeTree, err: TypeTree) => {
    return getTree('Result', name, { ok, err });
  },
  Vec: (name: string, type: TypeTree) => {
    return getTree('Vec', name, type);
  },
  BTreeMap: (name: string, key: string, value: TypeTree) => {
    return getTree('BTreeMap', name, { key, value });
  },
  BTreeSet: (name: string, type: TypeTree) => {
    return getTree('BTreeSet', name, type);
  },
};
