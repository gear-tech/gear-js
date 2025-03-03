import { Sails } from 'sails-js';
import { ISailsTypeDef } from 'sails-js-types';

import { Fieldset } from '@/shared/ui';

import { ISailsFuncArg } from '../../types';
import { getNestedName } from '../../utils';

import { EnumField } from './enum-field';
import { FixedSizeArrayField } from './fixed-size-array-field';
import { MapField } from './map-field';
import { OptionalField } from './optional-field';
import { PrimitiveField } from './primitive-field';
import { ResultField } from './result-field';
import { StructField } from './struct-field';
import { UserDefinedField } from './user-defined-field';
import { VecField } from './vec-field';

type Props = {
  sails: Sails;
  args: ISailsFuncArg[];
};

function Fields({ sails, args }: Props) {
  const getFieldComponent = (def: ISailsTypeDef) => {
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

  const renderField = (def: ISailsTypeDef, label: string = '', name: string = '') => {
    if (!sails) throw new Error('Sails is not defined');
    if (!def) return; // in case of empty enum variant, EnumVariant.def sails-js type is inaccurate at the moment

    const Field = getFieldComponent(def);

    return <Field key={name} def={def} sails={sails} name={name} label={label} renderField={renderField} />;
  };

  const renderFields = () =>
    args.map(({ typeDef, name }, index) => renderField(typeDef, name, getNestedName('payload', index.toString())));

  return args.length ? <Fieldset>{renderFields()}</Fieldset> : null;
}

export { Fields };
