import { Sails } from 'sails-js';

import { generateRandomId } from '@/shared/helpers';

import { EnumField } from './enum-field';
import { UserDefinedField } from './user-defined-field';
import { StructField } from './struct-field';
import { OptionalField } from './optional-field';
import { ResultField } from './result-field';
import { VecField } from './vec-field';
import { MapField } from './map-field';
import { FixedSizeArrayField } from './fixed-size-array-field';
import { PrimitiveField } from './primitive-field';
import { ISailsFuncArg, TypeDef } from '../../types';

type Props = {
  sails: Sails;
  args: ISailsFuncArg[];
};

function Fields({ sails, args }: Props) {
  const getFieldComponent = (def: TypeDef) => {
    if (def.isEnum) return EnumField;
    if (def.isStruct) return StructField;
    if (def.isOptional) return OptionalField;
    if (def.isResult) return ResultField;
    if (def.isVec) return VecField;
    if (def.isMap) return MapField;
    if (def.isFixedSizeArray) return FixedSizeArrayField;
    if (def.isUserDefined) return UserDefinedField;
    if (def.isPrimitive) return PrimitiveField;

    throw new Error('Unknown field type: ' + JSON.stringify(def));
  };

  const renderField = (def: TypeDef, label: string = '', name: string = '') => {
    if (!sails) throw new Error('Sails is not defined');
    if (!def) return; // in case of empty enum variant, EnumVariant.def sails-js type is inaccurate at the moment

    const key = generateRandomId();
    const Field = getFieldComponent(def);

    return <Field key={key} def={def} sails={sails} name={name} label={label} renderField={renderField} />;
  };

  return args.map(({ typeDef, name }, index) => renderField(typeDef, name, index.toString()));
}

export { Fields };
