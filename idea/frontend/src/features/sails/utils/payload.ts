import { Sails } from 'sails-js';

import { getPreformattedText } from '@/shared/helpers';

import { RESULT } from '../consts';
import { ISailsFuncArg, TypeDef } from '../types';

const getDefaultPayloadValue = (sails: Sails, args: ISailsFuncArg[]) => {
  const getDefaultValue = (def: TypeDef): unknown => {
    if (def.isPrimitive) return '';
    if (def.isOptional) return null;
    if (def.isResult) return { [RESULT.OK]: getDefaultValue(def.asResult[RESULT.OK].def) };
    if (def.isVec) return getPreformattedText([getDefaultValue(def.asVec.def)]);

    if (def.isFixedSizeArray)
      return new Array<unknown>(def.asFixedSizeArray.len).fill(getDefaultValue(def.asFixedSizeArray.def));

    if (def.isMap)
      // not sure about this one
      return getPreformattedText([[getDefaultValue(def.asMap.key.def), getDefaultValue(def.asMap.value.def)]]);

    if (def.isUserDefined) return getDefaultValue(sails.getTypeDef(def.asUserDefined.name));

    if (def.isStruct) {
      // not sure about this one
      if (def.asStruct.isTuple) return `[${def.asStruct.fields.map((field) => getDefaultValue(field.def)).join(', ')}]`;

      const result = def.asStruct.fields.map((field) => [field.name, getDefaultValue(field.def)]);

      return Object.fromEntries(result);
    }

    if (def.isEnum) {
      // check isNested
      const [defaultVariant] = def.asEnum.variants;

      return { [defaultVariant.name]: defaultVariant.def ? getDefaultValue(defaultVariant.def) : null };
    }

    throw new Error('Unknown type: ' + JSON.stringify(def));
  };

  return Object.fromEntries(args.map((arg, index) => [index, getDefaultValue(arg.typeDef)]));
};

export { getDefaultPayloadValue };
