import { TypeDef } from '../types';
import { getType } from './type';
import { getDefaultValue, getDefaultPayloadValue, getPayloadSchema, getResetPayloadValue } from './payload';

const getLabel = (name: string, def: TypeDef) => {
  const type = getType(def);

  return name ? `${name} (${type})` : type;
};

const getNestedName = (name: string, nestedName: string) => `${name}.${nestedName}`;

export { getLabel, getNestedName, getDefaultValue, getDefaultPayloadValue, getPayloadSchema, getResetPayloadValue };
