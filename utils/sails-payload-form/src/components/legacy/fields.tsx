import type { JSX, PropsWithChildren } from 'react';
import type { Sails } from 'sails-js';
import type { ISailsTypeDef } from 'sails-js/types';

import type { ISailsFuncArg } from '../../types';
import type { LegacyFieldProps } from '../../types/legacy-field-props';
import { getNestedName } from '../../utils/legacy-field';

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
  render: LegacyFieldProps['render'];
  renderContainer?: (props: PropsWithChildren) => JSX.Element;
};

function LegacyFields({ sails, args, render, renderContainer }: Props) {
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

    throw new Error(`Unknown field type: ${JSON.stringify(def)}`);
  };

  const renderField = (def: ISailsTypeDef, label = '', name = '') => {
    if (!def) return;

    const Field = getFieldComponent(def);

    return (
      <Field key={name} def={def} sails={sails} name={name} label={label} render={render} renderField={renderField} />
    );
  };

  const renderFields = () =>
    args.map(({ typeDef, name }, index) =>
      renderField(typeDef as ISailsTypeDef, name, getNestedName('payload', index.toString())),
    );

  return args.length && renderContainer ? renderContainer({ children: renderFields() }) : renderFields();
}

export { LegacyFields };
