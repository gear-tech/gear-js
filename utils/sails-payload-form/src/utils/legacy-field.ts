import type { ISailsTypeDef } from 'sails-js/types';

import { getLegacyType } from './legacy-type';

const getLegacyLabel = (name: string, def: ISailsTypeDef) => {
  const type = getLegacyType(def);

  return name ? `${name} (${type})` : type;
};

const getNestedName = (name: string, nestedName: string) => `${name}.${nestedName}`;

export { getLegacyLabel, getNestedName };
