import type { Type, TypeDecl } from 'sails-js/types';

import { getType } from './type';

const getLabel = (name: string, def: TypeDecl, resolvedType?: Type) => {
  const type = getType(def, resolvedType);

  return name ? `${name} (${type})` : type;
};

const getNestedName = (name: string, nestedName: string) => `${name}.${nestedName}`;

export { getLabel, getNestedName };
