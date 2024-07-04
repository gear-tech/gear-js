import { TypeDef } from 'sails-js';

import { getType } from './type';

const getLabel = (name: string, def: TypeDef) => {
  const type = getType(def);

  return name ? `${name} (${type})` : type;
};

const getNestedName = (name: string, nestedName: string) => `${name}.${nestedName}`;

export { getLabel, getNestedName };
