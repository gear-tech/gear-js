import { ISailsTypeDef } from 'sails-js-types';

import { getType } from './type';

const getLabel = (name: string, def: ISailsTypeDef) => {
  const type = getType(def);

  return name ? `${name} (${type})` : type;
};

const getNestedName = (name: string, nestedName: string) => `${name}.${nestedName}`;

export { getLabel, getNestedName };
